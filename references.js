/*  
    References file
    ===============

    For long JS objects that I don't want mucking up the actual code.

    Eventually, this whole file won't be static. The schedule and color scheme change between users,
    and keywords might too. the "colorCode" object changes week-to-week.
*/

var colors = {
                "A": "#00ff00",
                "B": "#ff0080",
                "C": "#029af5",
                "D": "#d75000",
                "E": "#ffd500",
                "F": "#00ffd5",
                "G": "#bc33ff",
                "H": "#5d5dfa",
                "I": "#12e29d",
                "J": "red",
                "K": "a7a7a7",
                "Z": "pink"

              }

var keywords = /(test|quiz|due|with)/i;



var schedule = {
                    "1": {
                        "1": "Algebra 2A",
                        "2": "English",
                        "3": "Parkhurst Biology",
                        "4": "F",
                        "5": "I",
                        "6": "K",
                        "7": "Spanish 3A",
                        "8": "World History I",
                        "9": "Z"
                    },
                    "2": {
                        "1": "C",
                        "2": "D",
                        "3": "Spanish 3A",
                        "4": "World History I",
                        "5": "I",
                        "6": "Percussion Ensemble",
                        "7": "Algebra 2A",
                        "8": "English",
                        "9": "Z"
                    },
                    "3": {
                        "1": "Parkhust Biology",
                        "2": "Parkhurst Biology",
                        "3": "Spanish 3A",
                        "4": "World History I",
                        "5": "J",
                        "6": "Robotics",
                        "7": "D",
                        "8": "C",
                        "9": "Z"
                    },
                    "4": {
                        "1": "Algebra 2A",
                        "2": "English",
                        "3": "D",
                        "4": "CS1",
                        "5": "I",
                        "6": "K",
                        "7": "Parkhurst Biology",
                        "8": "Robotics",
                        "9": "Z"
                    },
                    "5": {
                        "1": "Parkhurst Biology",
                        "2": "Robotics",
                        "3": "English",
                        "4": "Algebra 2A",
                        "5": "I",
                        "6": "Science Seminar",
                        "7": "World History I",
                        "8": "Spanish 3A",
                        "9": "Z"
                    }
                }

var colorCode = {
                    "1": {
                        "1": "B",
                        "2": "A",
                        "3": "E",
                        "4": "F",
                        "5": "I",
                        "6": "K",
                        "7": "H",
                        "8": "G",
                        "9": "Z"
                    },
                    "2": {
                        "1": "C",
                        "2": "D",
                        "3": "H",
                        "4": "G",
                        "5": "I",
                        "6": "K",
                        "7": "B",
                        "8": "A",
                        "9": "Z"
                    },
                    "3": {
                        "1": "E",
                        "2": "F",
                        "3": "H",
                        "4": "G",
                        "5": "J",
                        "6": "K",
                        "7": "D",
                        "8": "C",
                        "9": "Z"
                    },
                    "4": {
                        "1": "B",
                        "2": "A",
                        "3": "D",
                        "4": "C",
                        "5": "I",
                        "6": "K",
                        "7": "E",
                        "8": "F",
                        "9": "Z"
                    },
                    "5": {
                        "1": "E",
                        "2": "F",
                        "3": "A",
                        "4": "B",
                        "5": "I",
                        "6": "K",
                        "7": "G",
                        "8": "H",
                        "9": "Z"
                    }
                }



/* 
    An alternative:
    Array with objects, one for classes that meet 4 times per week, one for 3 times, 2 times, 1 time.
    Function 

    Just find someway to relate the letter-period to the class, to make it easier.
*/