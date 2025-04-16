from django.urls import path
from django.urls import path, include
from django.contrib.auth.views import LoginView 
from rest_framework.routers import DefaultRouter
from .views import extract_text, CreateLicense, generate_report, renew_subscription, trigger_email, list_software, get_software, delete_software, LicenseUpdateView, download_subscription
from .views import SubscriptionReportAPIView, SubscriptionDataAPIView, SubscriptionTypeReportAPIView, ProvidersListAPIView, SignUpView, SignInView, SignOutView, LoggedUser, UserProfileView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
# router.register(r"licenses", LicensesViewSet, basename="licenses")
 


urlpatterns = [

    path('licenses/', include(router.urls)),

    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), 

    path("api/license/extract/", extract_text, name="extract_text"),
    path("api/license-add/", CreateLicense.as_view(), name="create_license"),
    path('licenseS/', list_software, name='list_licenses'),  
    path('licenseS/<int:id>/', get_software, name='get_license'),
    path('license-triggerMail/', trigger_email, name='trigger_license'),
    path('license-update/<int:id>/', LicenseUpdateView.as_view(), name='update_license'),
    path('license-delete/<int:id>/', delete_software, name='delete_license'),
    path('licenseS/download/<int:id>/', download_subscription, name="download_license"),

    path('reports/subscription/', SubscriptionReportAPIView.as_view(), name='subscription_reports'),
    path('reports/subscription-type/', SubscriptionTypeReportAPIView.as_view(), name='subscription_types'),
    path('reports/providers/', ProvidersListAPIView.as_view(), name='providers_list'),
    path('reports/subscription-data/', SubscriptionDataAPIView.as_view(), name='subscription_data'),
    path("reports/generate/<str:format>/", generate_report, name="generate_report"),


    path('user/sign_up/', SignUpView.as_view(), name='sign_up'),
    path('user/sign_in/', SignInView.as_view(), name='api_sign_in'),
    path('user/sign_out/', SignOutView.as_view(), name='api_sign_out'),
    path('user/loggeduser/', LoggedUser.as_view(), name='api_sign_out'),

    path('profile/', UserProfileView.as_view(), name='user_profile'),

    path('renew/', renew_subscription,)
]