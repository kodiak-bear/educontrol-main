import '../../lib/date-1.0.0.min.js'
declare var Date:any;

import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Http, Response} from '@angular/http';
import {Student} from './student.model';
import {ConfigService} from '../config/config.service';


@Injectable()
export class StudentService {
    private baseUrl:string;

    constructor(private http:Http, private config:ConfigService) {
        this.baseUrl = this.config.baseUrl + 'students/'
    }


    /**
     * Get the list of students
     */
    index():Observable<Array<Student>> {
        return this.http.get(this.baseUrl)
            .map(this.extractData)
            .catch(this.handleError);
    }

    /**
     *
     * Add a new student
     * @param student
     * @returns {Observable<R>}
     */
    public add(student:Student) {
        return this.http.post(this.baseUrl, JSON.stringify(student))
            .map(this.extractData)
            .catch(this.handleError);
    }

    /**
     *
     * Update a student
     * @param student
     * @returns {Observable<R>}
     */
    public update(student:Student) {
        return this.http.put(this.baseUrl + student._id, JSON.stringify(student))
            .map(this.extractData)
            .catch(this.handleError);
    }

    /**
     *
     * Delete a student
     * @param student
     * @returns {Observable<R>}
     */
    public delete(student:Student) {
        return this.http.delete(this.baseUrl + student._id)
            .map(res => res.json())
            .catch(this.handleError);
    }

    /**
     * Parse the response
     * @param res
     * @returns {any|{}}
     */
    private extractData(res:Response) {

        let body = res.json();
        if (body) {
            if (body instanceof Array) {
                body.forEach(function (item) {
                    StudentService.convertDate(item);
                });
            } else {
                StudentService.convertDate(body);
            }
            return body;
        }
        return body || {};
    }

    /**
     * Convert the student's date properties
     * @param student
     * @returns {any}
     */
    private static convertDate(student):any{
        if (student.birthday) {
            student.birthday= Date.parse(student.birthday).toString('yyyy-MM-dd')
        }
        return student;
    }

    /**
     * Error handling
     * @param error
     * @returns {ErrorObservable}
     */
    private handleError(error:any) {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }
}