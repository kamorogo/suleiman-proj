from django import forms
from .models import License

from .models import Software



###########################################################################################################################################
###########################################################################################################################################
###########################################################################################################################################


                ######---USECASE2---#####
class SoftwareForm(forms.ModelForm):
    class Meta:
        model = Software
        fields = ['file']

    file = forms.FileField(required=True, label="Upload")



###########################################################################################################################################
###########################################################################################################################################
###########################################################################################################################################


                ######---USECASE1---#####   
class LicenseForm(forms.ModelForm):
    class Meta:
        model = License
        fields = ['file']

    file = forms.FileField(required=True, label="Upload License Document")
   
    # def clean_documents(self):
    #     document = self.cleaned_data.get('documents')
       
    #     if document:
    #         if not document.name.endswith(('.pdf')):
    #             raise forms.ValidationError('File must be a PDF.')
    #     return document
