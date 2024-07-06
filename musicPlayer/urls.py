from django.urls import path
from musicPlayer.views import index

urlpatterns = [

    path('', index, name='home'),

]