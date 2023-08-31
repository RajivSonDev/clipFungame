import { TestBed , ComponentFixture} from "@angular/core/testing";
import { AboutComponent } from "./about.component";


// Register the component
describe('About Component',()=>{
  
  let fixture:ComponentFixture<AboutComponent>;
  let componet:AboutComponent;
  
  beforeEach(async ()=>{
    await TestBed.configureTestingModule({
      declarations:[AboutComponent],
    }).compileComponents();
  })


  beforeEach(()=>{
     fixture=TestBed.createComponent(AboutComponent);
     componet=fixture.componentInstance;
     fixture.detectChanges();
  });

  it('should create',()=>{
    expect(componet).toBeTruthy();
  })
});