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
    * courses cannot contain more than 12 values. Or 0 values.
   
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