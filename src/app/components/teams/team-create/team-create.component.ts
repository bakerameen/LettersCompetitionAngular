import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Team } from '../teams.model';
import { TeamsService } from '../teams.service';

@Component({
  selector: 'app-team-create',
  templateUrl: './team-create.component.html',
  styleUrls: ['./team-create.component.scss']
})
export class TeamCreateComponent implements OnInit {
  value = 'Clear me';
  name = '';
  teamDescription = '';
  imagePreview = '';
  private mode = 'create';
  private teamId;
  team: Team;
  form: FormGroup;

  constructor(public teamservice: TeamsService, public router: ActivatedRoute) { }

  ngOnInit(): void {
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
          this.team = { id: teamData._id, name: teamData.name, description: teamData.description };
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

}
