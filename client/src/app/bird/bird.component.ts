import { Component, ElementRef, ViewChild } from "@angular/core";
import { Bird } from "../../../../common/tables/Bird";
import { CommunicationService } from "./../communication.service";

@Component({
  selector: "app-bird",
  templateUrl: "./bird.component.html",
  styleUrls: ["./bird.component.css"],
})
export class BirdComponent {
  @ViewChild("nomscientifique") nomscientifique: ElementRef;
  @ViewChild("nomcommun") nomcommun: ElementRef;
  @ViewChild("statutspeces") statutspeces: ElementRef;
  @ViewChild("nomscientifiquecomsommer") nomscientifiquecomsommer: ElementRef;
  

  public birds: Bird[] = [];
  public duplicateError: boolean = false;

  public constructor(private communicationService: CommunicationService) {}

  public ngOnInit(): void {
    this.getBirds();
  }

  public getBirds(): void {
    this.communicationService.getBirds().subscribe((birds: Bird[]) => {
      this.birds = birds;
    });
  }

  public insertBird(): void {
    const bird: any = {
      nomscientifique: this.nomscientifique.nativeElement.innerText,
      nomcommun: this.nomcommun.nativeElement.innerText,
      statutspeces: this.statutspeces.nativeElement.value,
      nomscientifiquecomsommer: this.nomscientifiquecomsommer.nativeElement.value,
    };

    this.communicationService.insertBird(bird).subscribe((res: number) => {
      if (res > 0) {
        this.communicationService.filter("update");
      }
      this.refresh();
      this.duplicateError = res === -1;
    });
  }

  private refresh() {
    this.getBirds();
    this.nomscientifique.nativeElement.innerText = "Rastafari";
    this.nomcommun.nativeElement.innerText = "Rasta";
    this.statutspeces.nativeElement.value = "";
    this.nomscientifiquecomsommer.nativeElement.value = "";
  }

  public deleteBird(nomscientifique: string) {
    this.communicationService.deleteBird(nomscientifique).subscribe((res: any) => {
      this.refresh();
    });
  }

  public changeBirdCommonName(event: any, i:number){
    const editField = event.target.textContent;
    this.birds[i].nomcommun = editField;
  }

  public changeBirdStatus(event: any, i:number){
    const editField = event.target.value ;
    this.birds[i].statutspeces = editField;
  }

  public changeBirdScNameConsumer(event: any, i:number){
    const editField = event.target.value;
    this.birds[i].nomscientifiquecomsommer = editField;
  }

  public updateBird(i: number) {
    this.communicationService.updateBird(this.birds[i]).subscribe((res: any) => {
      this.refresh();
    });
  }
}
