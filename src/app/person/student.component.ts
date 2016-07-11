import{Component, OnInit, EventEmitter, Output} from '@angular/core';
import{StudentService} from './student.service'
import{Student} from './student.model'
import {MdButton} from '@angular2-material/button';
import {MD_SIDENAV_DIRECTIVES} from '@angular2-material/sidenav';
import {MD_LIST_DIRECTIVES} from '@angular2-material/list';
import {MD_CARD_DIRECTIVES} from '@angular2-material/card';
import {MdInput, MdHint} from '@angular2-material/input';
import {MdIcon, MdIconRegistry} from '@angular2-material/icon';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {FormBuilder, Validators, FORM_DIRECTIVES, ControlGroup} from '@angular/common';

/**
 * Custom items
 */
import {AlertMessage, AlertMessageType} from '../base/alert-message';
import {AlertMessageService} from '../base/alert-message.service';
import {StringToDatePipe} from '../base/string-to-date.pipe';

// External libraries
declare var Date:any;
/**
 * Students management
 */
@Component({
    moduleId: module.id,
    selector: 'student',
    templateUrl: './student.component.html',
    styleUrls: ['./person.css'],
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
    providers: [StudentService],
    pipes: [StringToDatePipe]
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
    }


    /**
     * Load the students list
     */
    ngOnInit() {
        this.updateList();
    }

    /**
     * Refresh the list of students
     */
    updateList() {
        this.studentSvc.index().subscribe(
            students => {
                this.students = students;
            },
            error => this.alertMessageService.add(new AlertMessage(AlertMessageType.DANGER, error))
        );
    }

    /**
     * Submit the student values to the database
     */
    submitForm() {
        var student = new Student(this.studentForm.value);
        // Add the selected student's id, if available
        if (this.selectedStudent._id) {
            student._id = this.selectedStudent._id;
        }
        if (student._id) {
            // Edit student
            this.studentSvc.update(student).subscribe(student=> {
                    this.showForm = false;
                    this.alertMessageService.add(new AlertMessage(AlertMessageType.SUCCESS, 'Student has been updated'));
                    this.updateList();
                },
                error => this.alertMessageService.add(new AlertMessage(AlertMessageType.DANGER, error))
            );
        } else {
            // Add new student
            this.studentSvc.add(student).subscribe(student=> {
                    this.showForm = false;
                    this.alertMessageService.add(new AlertMessage(AlertMessageType.SUCCESS, 'New student has been added'));
                    this.updateList();
                },
                error => this.alertMessageService.add(new AlertMessage(AlertMessageType.DANGER, error))
            );
        }
    }

    /**
     * Add a new student
     */
    addStudent() {
        this.showForm = true;
        this.selectedStudent = new Student();
        this.updateForm(this.selectedStudent);
    }

    /**
     * Edit a student
     * @param student
     */
    editStudent(student) {
        this.showForm = true;
        this.selectedStudent = student;
        this.updateForm(this.selectedStudent);
    }

    /**
     * Delete a student
     * @param student
     */
    deleteStudent(student, index) {
        if (confirm('Delete student? This operation cannot be undone!')) {
            this.studentSvc.delete(student).subscribe(student=> {
                    this.showForm = false;
                    this.students.splice(index, 1);// Remove from the list
                    this.alertMessageService.add(new AlertMessage(AlertMessageType.SUCCESS, 'Student has been deleted'));
                },
                error => this.alertMessageService.add(new AlertMessage(AlertMessageType.DANGER, error))
            );
        }
    }

    /**
     * Update the form values
     * @param values
     */
    updateForm(values:Object = {}) {
        this.studentForm = this.fb.group({
            firstName: [this.selectedStudent.firstName || '', Validators.required],
            lastName: [this.selectedStudent.lastName || '', Validators.required],
            email: [this.selectedStudent.email || ''],
            birthday: [this.selectedStudent.birthday || '']
        });
    }

}

