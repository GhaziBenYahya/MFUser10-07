import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { ServiceService } from '../service.service';
import { RuleDto } from '../models/rule-dto';
import { ParamDto } from '../models/param-dto';
import { ObjectDto } from '../models/object-dto';
import { Rule, RuleObjet } from '../models/Rule';
import { MatDialog } from '@angular/material/dialog';
import { EditObjetComponent } from '../edit-objet/edit-objet.component'; // Importez votre composant edit-objet
import { EditParameterComponent } from '../edit-parameter/edit-parameter.component';
import { TokenService } from '../TokenService'
import {IdWorkflowService} from '../IdWorkflowService'




@Component({
  selector: 'app-add-rule',
  templateUrl: './add-rule.component.html',
  styleUrls: ['./add-rule.component.css'],
  //standalone: true,
  //imports: [FormsModule, CommonModule, NgClass, NgFor]
})
export class AddRuleComponent implements OnInit {
  
    token: string | null | undefined;

  // constructor( private srvParam: ParamService ,private srvRule: RuleService,private router: Router,){}
  constructor(private srvRule: ServiceService,private router: Router,private dialog: MatDialog,private tokenService: TokenService,private IdWorkflowService: IdWorkflowService){}
     IdObje : any = 0;
   selectedObjectType: string = ''; 

  
  showAddFormulaButton: boolean = false;
  showFormulaInputs: boolean = false;
  showFormulaObjectInputs: boolean = false;

  showObjectInputs: boolean =false;
  //objects: { name: string, order: string }[] = [];
  selectedItem = '2';
  Rule1 : RuleDto=new RuleDto()

  
  


  //ParamDto: ParamDto =new ParamDto();
  

  
  
  // Autres propriétés...

 


nameStep:string=''
rules:Rule[]=[]
objectsConstante:ObjectDto[]=[];
objectsSaisir:ObjectDto[]=[];
objectsVar:ObjectDto[]=[];


filteredConstant: ObjectDto[] = [];
filteredSaisir: ObjectDto[] = [];
filteredVar: ObjectDto[] = [];


searchTermConstant: string = '';
searchTermSaisir: string = '';
searchTermVar: string = '';


pageIndex = 1;
pageSize = 4;
    
  ngOnInit(): void {
console.log('succes')
/* *****service partage ****  // Accédez aux données stockées dans le service partagé et affichez-les dans la console
console.log('Token d\'accès service partagé: ', this.sharedDataService.getAccessToken()); */

// Récupérer le jeton à partir du service
this.token = this.tokenService.getToken();
console.log('réception de Token dans MFE_Rule ',this.tokenService.getToken())
        //get name
        const NameStep = this.IdWorkflowService.getNameStep(); 
        console.log('name Step localStorage IdStep',NameStep);
        this.nameStep=NameStep



        //get allRule
        this.firstGet()


}

firstGet(){
  this.srvRule.getAllObject().subscribe((res: any) => {

    console.log(res)
    this.objectsConstante = res.filter((objet: { type: string; }) => objet.type === 'Const');
    this.filteredConstant = this.objectsConstante.filter((objet: { status: string; }) => objet.status != 'false');

    this.objectsSaisir = res.filter((objet: { type: string; }) => objet.type === 'saisir');
    this.filteredSaisir = this.objectsSaisir.filter((objet: { status: string; }) => objet.status != 'false');

    this.objectsVar = res.filter((objet: { type: string; }) => objet.type === 'Var');
    this.filteredVar = this.objectsVar.filter((objet: { status: string; }) => objet.status != 'false');
/*           console.log("les filteredVar:",this.filteredVar)*/
    //console.log("les filteredVar:",this.objectsVar) 

  
  
   })

}

filterConstante(): void {
  this.filteredConstant = this.filteredConstant.filter(objet => 
    objet.content.toLowerCase().includes(this.searchTermConstant.toLowerCase())
  );
}
filterSaisir(): void {
  this.filteredSaisir = this.filteredSaisir.filter(objet => 
    objet.name.toLowerCase().includes(this.searchTermSaisir.toLowerCase())
  );
}
filterVar(): void {
  this.filteredVar = this.filteredVar.filter(objet => 
    objet.name.toLowerCase().includes(this.searchTermVar.toLowerCase())
  );
}

onPageChange(event: any): void {
  this.pageIndex = event.pageIndex + 1;
}

ListConstantView:string='true';
addConstantView:string='false';

ListSaisirView:string='true';
addSaisirView:string='false';

ListApiView:string='true';
addApiView:string='false';

constantView(){
  this.ListConstantView='false';
  this.addConstantView='true';
}

SaisirView(){
  this.ListSaisirView='false';
  this.addSaisirView='true';
}

ApiView(){
  this.ListApiView='false';
  this.addApiView='true';
}

addObjectOfList(obj:ObjectDto): void {

  // Ajoutez la nouvelle instance d'ObjectDto au tableau Objects
  this.Objects.push(obj);
  console.log(this.Objects)


}

retoureConstante(){
  this.ListConstantView='true';
  this.addConstantView='false';
}
retoureListAPI(){
  this.ListApiView='true';
  this.addApiView='false';

}
retoureListSaisir(){
  this.ListSaisirView='true';
  this.addSaisirView='false';

}

retoureListregle(){
  this.router.navigate(['/mfe1/orderComponent/MfeRule/ruleComponent/listRuleComponent']);
}



deleteObjectUtilise(obj:ObjectDto){
  // Afficher un message d'alerte de confirmation avant la suppression
  Swal.fire({
    title: 'Êtes-vous sûr?',
    text: 'Cette action est irréversible et supprimera l\'objet.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Oui, supprimer!',
    cancelButtonText: 'Annuler'
  }).then((result) => {
    if (result.isConfirmed) {
      // L'utilisateur a cliqué sur "Oui, supprimer"
      obj.status = "false"
      this.srvRule.editObject(obj,obj.id)
        .subscribe(
          (result) => { // succès
            console.log(result);
            Swal.fire('Objet est supprimée avec succès', '', 'success');
            //window.location.reload();
            this.firstGet()
             
             
          },
          (err) => {
            // traitement du cas d'erreur//             console.log(err);
            Swal.fire('Objet est supprimée avec succès aaaaaaaaaaaa', '', 'success');
            
           // window.location.reload();
          }
        );
    } else {
      // L'utilisateur a cliqué sur "Annuler" ou a cliqué en dehors de la boîte de dialogue
      Swal.fire('Suppression annulée', '', 'info');
    }
  });


}








































  
  
  addRule(): void{
    // console.log(this.Rule);
    // this.srvRule.addRule(this.Rule)
    //   .subscribe(
    //     (result) => { // success
    //       console.log(result);

    //       this.router.navigate(['/mfe-rule/orderComponent/listRuleComponent']);
    //       Swal.fire('Valider', '', 'success');  
    //     },
    //     (_err) => {
    //       // traitement du cas d'erreur
    //      console.log('err');
    //       Swal.fire('Invalid ', '', 'error');
    //     }
      
    //     ); 
    this.router.navigate(['/mfe-rule/ruleComponent/listRuleComponent']);


  }

  
  objectDto: ObjectDto = new ObjectDto(this.selectedObjectType)
  onObjectTypeChange(event: Event) {
    this.selectedObjectType = (event.target as HTMLSelectElement).value;
    console.log(this.selectedObjectType)
    this.showFormulaInputs = false
    this.ListConstantView='true';
    this.addConstantView='false';
    this.ListSaisirView='true';
    this.addSaisirView='false';
    this.ListApiView='true';
    this.addApiView='false';
    
    
  }

  //Formula for Add Objects
  onAddFormulaObjectClick( ): void {

    this.showFormulaObjectInputs = true;


  }
  //End
  

  onAddFormulaClick( ): void {

    this.showFormulaInputs = true;
  }





  /*******************************************************************Tableau des objet pour le regle ************************************************************************ */

  //tableau des objet de regle 
  ObjectDto: ObjectDto = new ObjectDto(this.selectedObjectType);
  Objects: ObjectDto[] = [];

  addObject(): void {




  
    // Enregistrez l'objet dans la base de données
    if(this.selectedObjectType != "Var"){
      this.ObjectDto.type= this.selectedObjectType;
      this.ObjectDto.name=this.ObjectDto.content
      console.log("aaaaaaaaa",this.ObjectDto)

          // Créez une nouvelle instance d'ObjectDto avec les valeurs actuelles de ObjectDto
    let newObject: ObjectDto = {
      name: this.ObjectDto.name, 
      content: this.ObjectDto.content,
      id:'' ,
      type: this.selectedObjectType,
      status:'',
      creationDate: new Date,
    };

      //Ajouter a la BD
      this.srvRule.addObjet(this.ObjectDto)
      .subscribe(
        (result) => { // En cas de succès
          console.log(result);
          Swal.fire('Valider', '', 'success');  
          console.log('Data saved');
          newObject.id = result

                          // Ajoutez la nouvelle instance d'ObjectDto au tableau Objects
                this.Objects.push(newObject);
                console.log("bbbbbbbbbbb",this.Objects)

              
                // Réinitialisez ObjectDto pour effacer les champs de saisie
                this.ObjectDto = { name: '', content: '' ,type:this.selectedObjectType , id:'' ,status:'',creationDate:''};


        },
        (error) => { // En cas d'erreur
          console.log('Error:', error);
          Swal.fire('Erreur', '', 'error');
        }
      );

    }

    
  

  }
  
  //**********************************************End Tableau des objet pour le regle**************************************************************************** */ 


//*********************************************************************Add Rule With Objects************************************************************************************************************************ */
 ruleObjets: RuleObjet[] = [];
ruleObjet = new RuleObjet('','')

 rule = new Rule(
  '',
  '',
  '',
  '',
  '',
  this.ruleObjets
);
idRule!:Rule;
Formule1: string = '';
//methode test



private static pattern: RegExp = /^[a-zA-Z0-9\s]+([+\-*/]\s*[a-zA-Z0-9\s]+)*\s*(<|>|==)\s*[a-zA-Z0-9]+[a-zA-Z0-9\s]+([+\-*/]\s*[a-zA-Z0-9][a-zA-Z0-9\s]+)*$/;
isValidFormula: boolean = false;
addRuleWithObjectstest(): void {
  // Liste pour stocker les RuleObjet
  const ruleObjets: RuleObjet[] = [];

    // Chaîne de caractères pour stocker les noms des ObjectDTO
    let Formule = '';

  // Parcourir le tableau d'objets ObjectDTO
  this.Objects.forEach((objectDTO, index) => {
    // Créer un RuleObjet à partir de l'ObjectDTO en cours de traitement
    const ruleObjet = new RuleObjet(objectDTO.id, index + 1); // Utilisez index + 1 comme rank

    // Ajouter le RuleObjet à la liste
    ruleObjets.push(ruleObjet);

        // Concaténer le nom de l'ObjectDTO à la chaîne de caractères
    // Concaténer le nom ou le contenu de l'ObjectDTO à la chaîne de caractères
    if (objectDTO.type === 'Operateur') {
      Formule += objectDTO.content + ' ';
    } else {
      Formule += objectDTO.name + ' ';
    }
  });





  // Afficher la liste de RuleObjet pour vérification
  
  this.Formule1 =Formule
  // Maintenant, tretement de Rule
  this.rule.formula=Formule
  this.rule.ruleObjets = ruleObjets
  console.log('Le Rule :', this.rule);


    //Test de expression de regle 
    this.isValidFormula = AddRuleComponent.pattern.test(this.rule.formula);
    if (this.isValidFormula) {
      // Logique pour ajouter la règle si la formule est valide
      console.log('La formule est valide et la règle est ajoutée.',this.rule.formula);

         // Enregistrez l'objet dans la base de données
   this.srvRule.addRuleWithObjects(this.rule)
    .subscribe(
      (result: any) => { // En cas de succès
        console.log(result);
        Swal.fire('Valider', '', 'success');  
       this.idRule =result;
        console.log("voila le resultat",this.idRule);

        // envoyer le id de rule
        const IdRule = this.idRule.id;

        // Stockez le token dans localStorage
        localStorage.setItem('IdRule', IdRule);
        console.log('Id Rule  localStorage Rule',localStorage);




        // get IdWorkflow and navigat vers le workflow
        const IdWorkflow = this.IdWorkflowService.getIdWorkflow(); 
        console.log('id Workflow localStorage Workflow',IdWorkflow);
        const IdStep = this.IdWorkflowService.getIdStep(); 
        console.log('id IdStep localStorage IdStep',IdStep);
        const RankStep = this.IdWorkflowService.getRankStep(); 
        console.log('id IdStep localStorage IdStep',RankStep);

        
        // pour envoyer le ids 
        localStorage.setItem('IdStep', IdStep);
        localStorage.setItem('RankStep', RankStep);

        this.router.navigate(['/mfe1/orderComponent/create-flowComponent/',IdWorkflow]);


   // Vider le tableau Parametres
  //this.Parametres.splice(0, this.Parametres.length);

      },
      (error) => { // En cas d'erreur
        console.log('Error:', error);
        Swal.fire('Erreur', '', 'error');
      }
    );  

    } else {
      // Logique pour gérer les erreurs de validation
      console.log('La formule est invalide.',this.rule.formula);
      Swal.fire('La formule est invalide', '', 'error');
    }



// fin test 


}
//fin methode test 




//*******************************************************************End Add Rule With Objects ************************************************************************************** */





























  //**********************************************AddObjectVAR---WithParameter**************************************************** */
  addObjectWithParametertest(): void {
    // Utilisez le tableau Parametres dans cette méthode
    console.log(this.Parametres);
        // Parcourir le tableau Parametres
        for (let i = 0; i < this.Parametres.length; i++) {
          // Attribuer à chaque ParamDto.objet.id la valeur i
          this.Parametres[i].objet.id = i;
        }
    
        // Afficher les Parametres mis à jour
        console.log(this.Parametres);
      
    
    // Ajoutez votre logique pour utiliser les Parametres ici
  }
  
  
  
  
  addObjectWithParameter(): void {
    // Créez une nouvelle instance d'ObjectDto avec les valeurs actuelles de ObjectDto
    const newObject: ObjectDto = {
      name: this.ObjectDto.name, content: this.ObjectDto.content,
      id: undefined,
      type: this.selectedObjectType,
      creationDate: undefined,
      status:''
    };
    
    // Enregistrez l'objet dans la base de données
    this.ObjectDto.type= this.selectedObjectType;
    this.srvRule.addObjet(this.ObjectDto)
      .subscribe(
        (result) => { // En cas de succès
          console.log(result);
          Swal.fire('Valider', '', 'success');  
          console.log(result);
          newObject.id=result
              // Parcourir le tableau Parametres
              for (let i = 0; i < this.Parametres.length; i++) {
              // Attribuer à chaque ParamDto.objet.id la valeur i
                this.Parametres[i].objet.id = result;

                //Save Parameter in DB
                this.srvRule.addParameter(this.Parametres[i])
                  .subscribe(
                     (result) => { // success
                        console.log(result);       
                       // Swal.fire('Valider', '', 'success');  
                        console.log('data saved');
                        // window.location.reload();
                      },
                      (_err) => {
                        // traitement du cas d'erreur
                        console.log('err');
                        Swal.fire('Invalid Parameter', '', 'error');
                                }
    
                               ); 

              }
     // Vider le tableau Parametres
    this.Parametres.splice(0, this.Parametres.length);

        },
        (error) => { // En cas d'erreur
          console.log('Error:', error);
          Swal.fire('Erreur', '', 'error');
        }
      );
  
    // Ajoutez la nouvelle instance d'ObjectDto au tableau Objects
    this.Objects.push(newObject);
  
    // Réinitialisez ObjectDto pour effacer les champs de saisie
    this.ObjectDto = { name: '', content: '' ,type:this.selectedObjectType ,status:'', id:'' ,creationDate:''};
  }
  
//********************************************************End AddObjectWithParameter****************************************************************** */















//*******************************************************************Tableau des paramters de regle ************************************************************************************** */
ParamDto: ParamDto = new ParamDto('', '', 0, 0); // Initialisation de ParamDto avec des valeurs par défaut
Parametres: ParamDto[] = [];

AddParamteter(): void {
  // Créez une nouvelle instance d'ObjectDto avec les valeurs actuelles de ObjectDto
  const newParamDto = new ParamDto(
    this.ParamDto.name,
    this.ParamDto.content,
    this.ParamDto.rank, // Assurez-vous de convertir rank en nombre si nécessaire
    this.ParamDto.objet.id) // ID de l'objet, vous devez fournir cette valeur ici
    
    
  

  // Enregistrez l'objet dans la base de données
/*   this.ObjectDto.type= this.selectedObjectType;
  this.srvRule.addObjet(this.ObjectDto)
    .subscribe(
      (result) => { // En cas de succès
        console.log(result);
        Swal.fire('Valider', '', 'success');  
        console.log('Data saved');
      },
      (error) => { // En cas d'erreur
        console.log('Error:', error);
        Swal.fire('Erreur', '', 'error');
      }
    ); */

  // Ajoutez la nouvelle instance d'ObjectDto au tableau Objects
  this.Parametres.push(newParamDto);

  // Réinitialisez ObjectDto pour effacer les champs de saisie
  this.ParamDto = new ParamDto('', '', 0, 0);
    }
//*******************************************************************End Tableau des paramters de regle ************************************************************************************** */




//*****************************************************************Supprimer un Parametre******************************************************** */
deleteParametre(index: number): void {
 

  Swal.fire({
    title: 'Êtes-vous sûr?',
    text: 'Cette action est irréversible et supprimerade parametre.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Oui, supprimer!',
    cancelButtonText: 'Annuler'
  }).then((result) => {
    if (result.isConfirmed) {
      // L'utilisateur a cliqué sur "Oui, supprimer"
      this.Parametres.splice(index, 1); // Supprimez l'élément à l'index spécifié

   
    } else {
      // L'utilisateur a cliqué sur "Annuler" ou a cliqué en dehors de la boîte de dialogue
      Swal.fire('Suppression annulée', '', 'info');
    }
  });
}
//*****************************************************************End Supprimer un Parametre******************************************************** */


//*****************************************************************Supprimer un Parametre******************************************************** */
deleteObject(index: number , idObjet: any): void {
  // Afficher un message d'alerte de confirmation avant la suppression
   Swal.fire({
     title: 'Êtes-vous sûr?',
     text: 'Cette action est irréversible et supprimera l Objet.',
     icon: 'warning',
     showCancelButton: true,
     confirmButtonText: 'Oui, supprimer!',
     cancelButtonText: 'Annuler'
   }).then((result) => {
     if (result.isConfirmed) {
       // L'utilisateur a cliqué sur "Oui, supprimer"
       this.srvRule.deleteObjet(idObjet)
         .subscribe(
           (result) => { // succès
             console.log(result);
             Swal.fire('l objet est supprimée avec succès', '', 'success');
             //window.location.reload();
               //supprimez l'element de tableau
              this.Objects.splice(index, 1); // Supprimez l'élément à l'index spécifié
           },
           (err) => {
             // traitement du cas d'erreur//             console.log(err);
             Swal.fire('L objet est supprimée avec succès ', '', 'success');
             this.Objects.splice(index, 1); // Supprimez l'élément à l'index spécifié
            // window.location.reload();
           }
         );
     } else {
       // L'utilisateur a cliqué sur "Annuler" ou a cliqué en dehors de la boîte de dialogue
       Swal.fire('Suppression annulée', '', 'info');
     }
   });


}
//*
//************************************************************Edit Objets********************************************************** */
openEditObjetDialog(objet: any): void {
  const dialogRef = this.dialog.open(EditObjetComponent, {
    width: '500px', // Largeur de la boîte de dialogue
    data: { objet } // Passer les données au composant edit-objet
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('Boîte de dialogue fermée'); // Logique à exécuter après la fermeture de la boîte de dialogue
  });
}



//*************************************************************Fin Edit Objet************************************************************** */


//************************************************************Edit Parametres********************************************************** */
openEditParametreDialog(objet: any): void {
  const dialogRef = this.dialog.open(EditParameterComponent, {
    width: '500px', // Largeur de la boîte de dialogue
    data: { objet } // Passer les données au composant edit-objet
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('Boîte de dialogue fermée'); // Logique à exécuter après la fermeture de la boîte de dialogue
  });
}



//*************************************************************Fin Edit Parametres************************************************************** */





















































































  //ObjectDto: ObjectDto = new ObjectDto(this.selectedObjectType);
  
  AddObjectClick(): void{

//save Object 
    this.ObjectDto.type= this.selectedObjectType;
    console.log(this.objectDto.type)
    console.log(this.ObjectDto);
    this.srvRule.addObjet(this.ObjectDto)
      .subscribe(
        (result) => { // success
          console.log(result);

          
          Swal.fire('Valider', '', 'success');  
          console.log('data saved');
          //window.location.reload();
        },
        (_err) => {
          // traitement du cas d'erreur
         console.log('err');
          Swal.fire('Invalid ', '', 'error');
        }
      
        ); 


  }


  
 
  AddObjet(): void{
    
    console.log(this.ObjectDto);
    //Ajouter un Objet 
    this.srvRule.addObjet(this.ObjectDto)
      .subscribe(
        (result) => { // success
          console.log(result);
           this.IdObje = result
           

          
          Swal.fire('Valider', '', 'success');  
          console.log('data saved');
         // window.location.reload();
        },
        (_err) => {
          // traitement du cas d'erreur
         console.log('err');
          Swal.fire('Invalid ', '', 'error');
        }
      
        ); 


  }
    //ParamDto: ParamDto = new ParamDto();

 /*  AddParam(): void{
    
    console.log(this.ObjectDto);
    //Ajouter un Param 
    this.srvRule.addParam(this.ParamDto)
      .subscribe(
        (result) => { // success
          console.log(result);
           

          
          Swal.fire('Valider', '', 'success');  
          console.log('data saved');
         // window.location.reload();
        },
        (_err) => {
          // traitement du cas d'erreur
         console.log('err');
          Swal.fire('Invalid ', '', 'error');
        }
      
        ); 

  }

 */

}