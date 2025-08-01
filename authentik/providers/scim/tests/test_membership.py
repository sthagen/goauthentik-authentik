"""SCIM Membership tests"""

from django.test import TestCase
from requests_mock import Mocker

from authentik.blueprints.tests import apply_blueprint
from authentik.core.models import Application, Group, User
from authentik.lib.generators import generate_id
from authentik.providers.scim.clients.schema import ServiceProviderConfiguration
from authentik.providers.scim.models import SCIMMapping, SCIMProvider
from authentik.providers.scim.tasks import scim_sync
from authentik.tenants.models import Tenant


class SCIMMembershipTests(TestCase):
    """SCIM Membership tests"""

    provider: SCIMProvider
    app: Application

    def setUp(self) -> None:
        # Delete all users and groups as the mocked HTTP responses only return one ID
        # which will cause errors with multiple users
        User.objects.all().exclude_anonymous().delete()
        Group.objects.all().delete()
        Tenant.objects.update(avatars="none")

    @apply_blueprint("system/providers-scim.yaml")
    def configure(self) -> None:
        """Configure provider"""
        self.provider: SCIMProvider = SCIMProvider.objects.create(
            name=generate_id(),
            url="https://localhost",
            token=generate_id(),
        )
        self.app: Application = Application.objects.create(
            name=generate_id(),
            slug=generate_id(),
        )
        self.app.backchannel_providers.add(self.provider)
        self.provider.save()
        self.provider.property_mappings.set(
            [SCIMMapping.objects.get(managed="goauthentik.io/providers/scim/user")]
        )
        self.provider.property_mappings_group.set(
            [SCIMMapping.objects.get(managed="goauthentik.io/providers/scim/group")]
        )

    def test_member_add(self):
        """Test member add"""
        config = ServiceProviderConfiguration.default()

        config.patch.supported = True
        user_scim_id = generate_id()
        group_scim_id = generate_id()
        uid = generate_id()
        group = Group.objects.create(
            name=uid,
        )

        user = User.objects.create(username=generate_id())

        with Mocker() as mocker:
            mocker.get(
                "https://localhost/ServiceProviderConfig",
                json=config.model_dump(),
            )
            mocker.post(
                "https://localhost/Users",
                json={
                    "id": user_scim_id,
                },
            )
            mocker.post(
                "https://localhost/Groups",
                json={
                    "id": group_scim_id,
                },
            )

            self.configure()
            scim_sync.send(self.provider.pk)

            self.assertEqual(mocker.call_count, 4)
            self.assertEqual(mocker.request_history[0].method, "GET")
            self.assertEqual(mocker.request_history[1].method, "POST")
            self.assertEqual(mocker.request_history[2].method, "GET")
            self.assertEqual(mocker.request_history[3].method, "POST")
            self.assertJSONEqual(
                mocker.request_history[1].body,
                {
                    "schemas": ["urn:ietf:params:scim:schemas:core:2.0:User"],
                    "emails": [],
                    "active": True,
                    "externalId": user.uid,
                    "name": {"familyName": " ", "formatted": " ", "givenName": ""},
                    "displayName": "",
                    "userName": user.username,
                },
            )
            self.assertJSONEqual(
                mocker.request_history[3].body,
                {
                    "schemas": ["urn:ietf:params:scim:schemas:core:2.0:Group"],
                    "externalId": str(group.pk),
                    "displayName": group.name,
                },
            )

        with Mocker() as mocker:
            mocker.get(
                "https://localhost/ServiceProviderConfig",
                json=config.model_dump(),
            )
            mocker.patch(
                f"https://localhost/Groups/{group_scim_id}",
                json={},
            )
            group.users.add(user)
            self.assertEqual(mocker.call_count, 2)
            self.assertEqual(mocker.request_history[0].method, "GET")
            self.assertEqual(mocker.request_history[1].method, "PATCH")
            self.assertJSONEqual(
                mocker.request_history[1].body,
                {
                    "schemas": ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
                    "Operations": [
                        {
                            "op": "add",
                            "path": "members",
                            "value": [{"value": user_scim_id}],
                        }
                    ],
                },
            )

    def test_member_remove(self):
        """Test member remove"""
        config = ServiceProviderConfiguration.default()

        config.patch.supported = True
        user_scim_id = generate_id()
        group_scim_id = generate_id()
        uid = generate_id()
        group = Group.objects.create(
            name=uid,
        )

        user = User.objects.create(username=generate_id())

        with Mocker() as mocker:
            mocker.get(
                "https://localhost/ServiceProviderConfig",
                json=config.model_dump(),
            )
            mocker.post(
                "https://localhost/Users",
                json={
                    "id": user_scim_id,
                },
            )
            mocker.post(
                "https://localhost/Groups",
                json={
                    "id": group_scim_id,
                },
            )

            self.configure()
            scim_sync.send(self.provider.pk)

            self.assertEqual(mocker.call_count, 4)
            self.assertEqual(mocker.request_history[0].method, "GET")
            self.assertEqual(mocker.request_history[1].method, "POST")
            self.assertEqual(mocker.request_history[2].method, "GET")
            self.assertEqual(mocker.request_history[3].method, "POST")
            self.assertJSONEqual(
                mocker.request_history[1].body,
                {
                    "schemas": ["urn:ietf:params:scim:schemas:core:2.0:User"],
                    "active": True,
                    "displayName": "",
                    "emails": [],
                    "externalId": user.uid,
                    "name": {"familyName": " ", "formatted": " ", "givenName": ""},
                    "userName": user.username,
                },
            )
            self.assertJSONEqual(
                mocker.request_history[3].body,
                {
                    "schemas": ["urn:ietf:params:scim:schemas:core:2.0:Group"],
                    "externalId": str(group.pk),
                    "displayName": group.name,
                },
            )

        with Mocker() as mocker:
            mocker.get(
                "https://localhost/ServiceProviderConfig",
                json=config.model_dump(),
            )
            mocker.patch(
                f"https://localhost/Groups/{group_scim_id}",
                json={},
            )
            group.users.add(user)
            self.assertEqual(mocker.call_count, 2)
            self.assertEqual(mocker.request_history[0].method, "GET")
            self.assertEqual(mocker.request_history[1].method, "PATCH")
            self.assertJSONEqual(
                mocker.request_history[1].body,
                {
                    "schemas": ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
                    "Operations": [
                        {
                            "op": "add",
                            "path": "members",
                            "value": [{"value": user_scim_id}],
                        }
                    ],
                },
            )

        with Mocker() as mocker:
            mocker.get(
                "https://localhost/ServiceProviderConfig",
                json=config.model_dump(),
            )
            mocker.patch(
                f"https://localhost/Groups/{group_scim_id}",
                json={},
            )
            group.users.remove(user)
            self.assertEqual(mocker.call_count, 2)
            self.assertEqual(mocker.request_history[0].method, "GET")
            self.assertEqual(mocker.request_history[1].method, "PATCH")
            self.assertJSONEqual(
                mocker.request_history[1].body,
                {
                    "schemas": ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
                    "Operations": [
                        {
                            "op": "remove",
                            "path": "members",
                            "value": [{"value": user_scim_id}],
                        }
                    ],
                },
            )

    def test_member_add_save(self):
        """Test member add + save"""
        config = ServiceProviderConfiguration.default()

        config.patch.supported = True
        user_scim_id = generate_id()
        group_scim_id = generate_id()
        uid = generate_id()
        group = Group.objects.create(
            name=uid,
        )

        user = User.objects.create(username=generate_id())

        # Test initial sync of group creation
        with Mocker() as mocker:
            mocker.get(
                "https://localhost/ServiceProviderConfig",
                json=config.model_dump(),
            )
            mocker.post(
                "https://localhost/Users",
                json={
                    "id": user_scim_id,
                },
            )
            mocker.post(
                "https://localhost/Groups",
                json={
                    "id": group_scim_id,
                },
            )

            self.configure()
            scim_sync.send(self.provider.pk)

            self.assertEqual(mocker.call_count, 4)
            self.assertEqual(mocker.request_history[0].method, "GET")
            self.assertEqual(mocker.request_history[1].method, "POST")
            self.assertEqual(mocker.request_history[2].method, "GET")
            self.assertEqual(mocker.request_history[3].method, "POST")
            self.assertJSONEqual(
                mocker.request_history[1].body,
                {
                    "schemas": ["urn:ietf:params:scim:schemas:core:2.0:User"],
                    "emails": [],
                    "active": True,
                    "externalId": user.uid,
                    "name": {"familyName": " ", "formatted": " ", "givenName": ""},
                    "displayName": "",
                    "userName": user.username,
                },
            )
            self.assertJSONEqual(
                mocker.request_history[3].body,
                {
                    "schemas": ["urn:ietf:params:scim:schemas:core:2.0:Group"],
                    "externalId": str(group.pk),
                    "displayName": group.name,
                },
            )

        with Mocker() as mocker:
            mocker.get(
                "https://localhost/ServiceProviderConfig",
                json=config.model_dump(),
            )
            mocker.get(
                f"https://localhost/Groups/{group_scim_id}",
                json={},
            )
            mocker.patch(
                f"https://localhost/Groups/{group_scim_id}",
                json={},
            )
            group.users.add(user)
            group.save()
            self.assertEqual(mocker.call_count, 5)
            self.assertEqual(mocker.request_history[0].method, "GET")
            self.assertEqual(mocker.request_history[1].method, "PATCH")
            self.assertEqual(mocker.request_history[2].method, "GET")
            self.assertEqual(mocker.request_history[3].method, "PATCH")
            self.assertEqual(mocker.request_history[4].method, "GET")
            self.assertJSONEqual(
                mocker.request_history[1].body,
                {
                    "schemas": ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
                    "Operations": [
                        {
                            "op": "add",
                            "path": "members",
                            "value": [{"value": user_scim_id}],
                        }
                    ],
                },
            )
            self.assertJSONEqual(
                mocker.request_history[3].body,
                {
                    "Operations": [
                        {
                            "op": "replace",
                            "value": {
                                "id": group_scim_id,
                                "displayName": group.name,
                                "schemas": ["urn:ietf:params:scim:schemas:core:2.0:Group"],
                                "externalId": str(group.pk),
                            },
                        }
                    ]
                },
            )
