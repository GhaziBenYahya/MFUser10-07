export class ObjectDto {
  id :any
  name: string = '';
  type: any;
  content: string = '';
  status:string = ''
  creationDate: any;
  

  constructor( selectedObjectType: any ) {

    this.type = selectedObjectType;

  }

  }
