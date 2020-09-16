import {ElementRef} from "@angular/core";

declare var M

export class MaterialService {
  static toast(message: string){
    M.toast({html: message})
  }

  static initializeFloatingButton(ref: ElementRef){
    M.floatingActionButton.init(ref.nativeElement)
  }
  static updateTextInputs(){
    M.updateTextFields()
  }
}
