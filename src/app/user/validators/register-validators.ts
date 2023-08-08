import { ValidationErrors , AbstractControl, ValidatorFn} from "@angular/forms"

export class RegisterValidators {
    
    static match(controlName:string,matchingControlName:string){

        return (group:AbstractControl) : ValidationErrors | null =>{
            const control=group.get('password')
            const matchingControl = group.get('confirm_password')
    
    
            if(!control || !matchingControl){
                console.log('Form Controls can not be found  in the form group.')
                return {controlNotFound:false}
            }
    
            const error=control.value===matchingControl.value?
            null:{noMatch:true}
            // using this is not allow in static method
           

            matchingControl.setErrors(error)
            return error;


        }

       
    }
}

// new RegisterValidators.match() <- Without Static 
// RegisterValidators.match() <- With Static
