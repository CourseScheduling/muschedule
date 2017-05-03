var Course = 
{
  "code": "CPSC 110",
  "name": "Introduction into Comp SCi",
  "description": "Students get a comprehensive view of the comp sci stuff",
  "schedules": [
    [
      [289315881, 82335081, 593632534, 192872887, 262245642],
      [535833425, 34562146, 834911512, 813923158, 13890574],
      [351566562, 270594115, 800712045, 546448130, 970288241],
      [817694717, 754383485, 142053724, 440371363, 762291683]
    ]
  },
  "types": [ // Should correspond to order of "sections".
    "Lecture",
    "Lab"
  ],
  "sections": [
    [Section],
    [Section]
  ]
}



var Section = 
{
  "uniq": "CPSC 110 101",
  "section": "101",
  "type": "Lecture",
  "schedule": 0 // Corresponds to time array in Course, For Section Type.
}