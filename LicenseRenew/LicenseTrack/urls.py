from django.urls import path
# from .views import trigger_license_reminders, LicenseView, RenewLicenseView, upload_license
# from .views import retrieve_license, add_license, update_license, edit_license, delete_license, LicenseReport

from django.urls import path, include
from django.contrib.auth.views import LoginView 
from rest_framework.routers import DefaultRouter
# from .views import upload_software, list_software, get_software, delete_software, update_software, , RenewSoftwareAPI
# from .views import LicensesViewSet, trigger_email, license_add, EditLicense
from .views import extract_text, create_license, trigger_email, list_software, get_software, delete_software, LicenseUpdateView, download_subscription
from .views import SubscriptionReportAPIView, SubscriptionDataAPIView, SubscriptionTypeReportAPIView, ProvidersListAPIView


router = DefaultRouter()
# router.register(r"licenses", LicensesViewSet, basename="licenses")


urlpatterns = [
###########################################################################################################################################
###########################################################################################################################################
###########################################################################################################################################
    path('licenses/', include(router.urls)),
    

    path("api/license/extract/", extract_text, name="extract_text"),
    path("api/license-add/", create_license, name="create_license"),
    path('licenseS/', list_software, name='list_licenses'),  
    path('licenseS/<int:id>/', get_software, name='get_license'),
    path('trigger_mail/', trigger_email, name='trigger_license'),
    path('license-update/<int:id>/', LicenseUpdateView.as_view(), name='update_license'),
    path('license-delete/<int:id>/', delete_software, name='delete_license'),
    path('licenseS/download/<int:id>/', download_subscription, name="download_license"),


    path('reports/subscription/', SubscriptionReportAPIView.as_view(), name='subscription_reports'),
    path('reports/subscription-type/', SubscriptionTypeReportAPIView.as_view(), name='subscription_types'),
    path('reports/providers/', ProvidersListAPIView.as_view(), name='providers_list'),
    path('reports/subscription-data/', SubscriptionDataAPIView.as_view(), name='subscription_data'),


    ###---USECASE2---###
    # path('upload-license/', upload_software, name='upload_license'),
    # path('licenseS/', list_software, name='list_licenses'),  
    # path('licenseS/<int:id>/', get_software, name='get_license'),
    # path('license-update/<int:id>/', update_software, name='update_license'),
    # path('license-delete/<int:id>/', delete_software, name='delete_license'),
    # path('api/license-add/', license_add, name="add_license"),
    # path('license-edit/<int:license_id>/', EditLicense.as_view(), name='edit_license'),
    # path('trigger_mail/', trigger_email, name='trigger_license'),
    # path('licenses/renew/<int:id>/', RenewSoftwareAPI.as_view(), name='renew_license'),
    # path('licenseS/', LicensesViewSet.as_view({'get': 'list_licenses'})), 
    # path('software/generate_pdf/', LicensesViewSet.as_view({'get': 'generate_pdf'}), name='generate_pdf'),
    # path('software/generate_excel/', LicensesViewSet.as_view({'get': 'generate_excel'}), name='generate_excel'),
    


###########################################################################################################################################
###########################################################################################################################################
###########################################################################################################################################


    ###---USECASE1---###
    # path('api/license/upload/<license_type>', upload_license, name='upload_license'),
    # path('api/v1/store-license/', views.store_license, name='store_license'),
    # path('retrieve-license/<param_id>/', retrieve_license, name='retrieve_license'),
    # path('add-license/<license_number>/', add_license, name='add_license'),
    # path('update-license/<license_number>/<license_type>/', update_license, name='update_license'),
    # path('edit-license/<license_number>/', edit_license, name='edit_license'),
    # path('delete-license/<str:license_number>/', delete_license, name='delete_license'),
    # path('trigger_license_reminders/', trigger_license_reminders, name='trigger_license_reminders'),
    # # path('api/licenses/', LicenseReport.as_view(), name='license-report'),
    # path('api/licenses/', LicenseView.as_view(), name='license-list'), 
    # path('api/licenses/<int:pk>/', LicenseView.as_view(), name='license-detail'),
    # path('renew/licenses/<int:license_id>/', RenewLicenseView.as_view(), name='renew-license'),
]