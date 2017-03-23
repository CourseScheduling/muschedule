#getCourses
---
Grab the courses from the model as specified.

* **URL** 
  `/courses/get`

* **Method**
   `GET`
  
* **URL Params**
   These are the most important part of this route. CSV is a string of comma separated values.
   *Required*
   `courses=[CSV<String>]`
    * you cannot put in more than 12 courses
   
* **Success Response**
   * **Code**: 200
   * **Content**: 
   ```
    {
        courses: []
    }
   ```   
   
* **Error Response**
   * **Code**: 200
   * **Content**: 
   ```
    {
        error: "You put in too many courses..."
    }
   ```