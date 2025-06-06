"""proxy provider tasks"""

from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

from authentik.outposts.consumer import OUTPOST_GROUP
from authentik.outposts.models import Outpost, OutpostType
from authentik.providers.oauth2.id_token import hash_session_key
from authentik.root.celery import CELERY_APP


@CELERY_APP.task()
def proxy_on_logout(session_id: str):
    """Update outpost instances connected to a single outpost"""
    layer = get_channel_layer()
    hashed_session_id = hash_session_key(session_id)
    for outpost in Outpost.objects.filter(type=OutpostType.PROXY):
        group = OUTPOST_GROUP % {"outpost_pk": str(outpost.pk)}
        async_to_sync(layer.group_send)(
            group,
            {
                "type": "event.provider.specific",
                "sub_type": "logout",
                "session_id": hashed_session_id,
            },
        )
