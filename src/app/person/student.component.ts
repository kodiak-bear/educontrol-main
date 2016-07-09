import{Component, OnInit, EventEmitter, Output} from '@angular/core';
import{StudentService} from './student.service'
import{Student} from './student.model'
import {MdButton} from '@angular2-material/button';
import {MD_SIDENAV_DIRECTIVES} from '@angular2-material/sidenav';
import {MD_LIST_DIRECTIVES} from '@angular2-material/list';
import {MD_CARD_DIRECTIVES} from '@angular2-material/card';
import {MdInput, MdHint} from '@angular2-material/input';
import {MdIcon, MdIconRegistry} from '@angular2-material/icon';
import {ROUTER_DIRECTIVES, ROUTER_PROVIDERS, Routes} from '@angular/router';
import {FormBuilder, Validators, FORM_DIRECTIVES, ControlGroup} from '@angular/common';

/**
 * Custom items
 */
import {AlertMessage, AlertMessageType} from '../base/alert-message';
import {AlertMessageService} from '../base/alert-message.service';

// External libraries
declare var Date:any;
/**
 * Students management
 */
@Component({
    moduleId: module.id,
    selector: 'student',
    templateUrl: './student.component.html',
    directives: [
        MD_SIDENAV_DIRECTIVES,
        MD_LIST_DIRECTIVES,
        MD_CARD_DIRECTIVES,
        MdButton,
        MdInput,
        MdHint,
        MdIcon,
        ROUTER_DIRECTIVES,
        FORM_DIRECTIVES
    ],
    providers: [StudentService]
})
/**
 *
 */
export class StudentComponent {
    selectedStudent:Student; // student to edit
    students:Array<Student>; // List of all students

    showForm:boolean; // Whether the students form should be displayed

    studentForm:ControlGroup; // When creating new student

    constructor(private fb:FormBuilder, private studentSvc:StudentService, private alertMessageService:AlertMessageService) {
        this.studentForm = fb.group({
            firstName: ["", Validators.required],
            lastName: ["", Validators.required],
            email: [""],
            birthdate: []
        });
    }


    /**
     * Load the students list
     */
    ngOnInit() {
        this.studentSvc.index().subscribe(
            students => {this.students = students; console.log('Students list loaded'); this.alertMessageService.add(new AlertMessage(AlertMessageType.SUCCESS, 'Students list has been loaded'));},
            error => this.alertMessageService.add(new AlertMessage(AlertMessageType.DANGER, error))
        );
    }


    add() {
        var student = new Student(this.studentForm.value);
        this.studentSvc.add(student).subscribe(student=> {
                this.selectedStudent = student;
                this.showForm = false;
                this.alertMessageService.add(new AlertMessage(AlertMessageType.SUCCESS, 'Student has been saved'));
            },
            error => this.alertMessageService.add(new AlertMessage(AlertMessageType.DANGER, error))
        );
    }


}
