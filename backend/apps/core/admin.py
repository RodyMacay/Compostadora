from django.contrib import admin

from apps.core.models import Compost, Recommendation

# Register your models here.
admin.site.register(Compost)
admin.site.register(Recommendation)