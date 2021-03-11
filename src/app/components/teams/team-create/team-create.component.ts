import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { Team } from '../teams.model';
import { TeamsService } from '../teams.service';

@Component({
  selector: 'app-team-create',
  templateUrl: './team-create.component.html',
  styleUrls: ['./team-create.component.scss']
})
export class TeamCreateComponent implements OnInit, OnDestroy {
  isLodaing = false;
  value = 'Clear me';
  name = '';
  teamDescription = '';
  imagePreview = '';
  private mode = 'create';
  private teamId;
  team: Team;
  form: FormGroup;
  private authStatusSub: Subscription;

  constructor(public teamservice: TeamsService, public router: ActivatedRoute, private authService: AuthService) { }

  ngOnInit(): void {
    this.authStatusSub = this.authService.geAuthStatusListener().subscribe(
      authStatus => {
        this.isLodaing = false;
      }
    );
    this.form = new FormGroup({
      name: new FormControl(null, { validators: [Validators.minLength(3)]
      }),
      teamDescription: new FormControl(null),
      // image: new FormControl(null)
    });
    this.router.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('teamId')) {
        this.mode = 'edit';
        this.teamId = paramMap.get('teamId');
        this.teamservice.getTeam(this.teamId).subscribe(teamData => {
          this.team = { id: teamData._id, name: teamData.name, description: teamData.description, fPlayer: teamData.fPlayer, sPlayer: teamData.sPlayer, tPlayer: teamData.tPlayer, foPlayer: teamData.foPlayer, score: teamData.score };
          this.form.setValue({
            name: this.team.name,
            teamDescription: this.team.description
          });
        });

      } else {
        this.mode = 'create';
        this.teamId = null;
      }
    });
  }

  // onImagePicked(event: Event) {
  //   const file = (event.target as HTMLInputElement).files[0];
  //   this.form.patchValue({image: file});
  //   this.form.get('image').updateValueAndValidity();
  //   const reader = new FileReader();

  //   reader.onload = () => {
  //     this.imagePreview = reader.result as string;
  //   };
  //   reader.readAsDataURL(file);
  // }
  onSaveTeams() {

    if (this.form.invalid) {
      return;
    }

    if (this.mode === 'create') {
      this.teamservice.addTeam(this.form.value.name, this.form.value.teamDescription);
    } else {
      this.teamservice.updateTeam(this.teamId, this.form.value.name, this.form.value.teamDescription);
    }

    this.form.reset();
  }

  ngOnDestroy(){
    this.authStatusSub.unsubscribe();
  }

}
