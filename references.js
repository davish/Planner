/*  
    References file
    ===============
    This is just a placeholder until the backend is implemented. The 'ref' object will just be an object that
    gets passed back and forth between the client and server; if it all goes according to plan, when the 
    backend is finished, only one function, assigning 'ref' to the response of an AJAX POST request,
    will need to be implemented for the planner to function.

    Day 5 and the assignments change week-to-week, but there's no diff

    Oh, and users. but hopefully that'll be covered in meeting with NLTL.
*/

var ref = {
    monday: new Date(2014, 2, 10),

    assignments: {
        11: "JERGENS", 12: "test", 13: "", 14: "", 15: "", 16: "", 17: "", 18: "", 19: "", 
        21: "", 22: "side lard: jiggling!", 23: "", 24: "", 25: "", 26: "", 27: "", 28: "", 29: "", 
        31: "", 32: "", 33: "", 34: "smesmesme", 35: "test j period", 36: "", 37: "", 38: "", 39: "", 
        41: "", 42: "", 43: "", 44: "quiz", 45: "mass decreasing!", 46: "", 47: "", 48: "", 49: "", 
        51: "", 52: "", 53: "", 54: "", 55: "", 56: "", 57: "", 58: "", 59: "", 00: undefined
    },

    colors: {
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

    },

    keywords: /(test|urgent|quiz|due|with)/i, // regex with filtering keywords

    kwStyle: { // object with the 'span.class' that each keyword corresponds to.
        "test": "high",
        "urgent":"high",
        "quiz": "mid",
        "due": "low",
        "with": "lab"
    },



    schedule: {
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
    },

    colorCode: {
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
}