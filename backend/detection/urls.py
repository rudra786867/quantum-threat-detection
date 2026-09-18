from django.urls import path
from . import views

urlpatterns = [
    path("", views.home, name="home"),
    path("verify/", views.verify_signature, name="verify_signature"),
    path("history/", views.audit_history, name="audit_history"),
    path("history/clear/", views.clear_history, name="clear_history"),
]
