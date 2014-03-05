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
                "K": "a7a7a7"

              }

              /* 

                "A": "#FF0000",
                "B": "#FF7400",
                "C": "#1826B0",
                "D": "#086CA2",
                "E": "#00C12B",
                "F": "#F0FC00",
                "G": "#B1009B",
                "H": "#580EAD",
                "I": "#FFC700",
                "J": "1240AB",
                "K": "#BADA55"
              */

var schedule = {
                    "1": {
                        "1": "B",
                        "2": "A",
                        "3": "E",
                        "4": "F",
                        "5": "I",
                        "6": "K",
                        "7": "H",
                        "8": "G"
                    },
                    "2": {
                        "1": "C",
                        "2": "D",
                        "3": "H",
                        "4": "G",
                        "5": "I",
                        "6": "K",
                        "7": "B",
                        "8": "A"
                    },
                    "3": {
                        "1": "E",
                        "2": "F",
                        "3": "H",
                        "4": "G",
                        "5": "J",
                        "6": "K",
                        "7": "D",
                        "8": "C"
                    },
                    "4": {
                        "1": "B",
                        "2": "A",
                        "3": "D",
                        "4": "C",
                        "5": "I",
                        "6": "K",
                        "7": "E",
                        "8": "F"
                    },
                    "5": {
                        "1": "E",
                        "2": "F",
                        "3": "A",
                        "4": "B",
                        "5": "I",
                        "6": "K",
                        "7": "G",
                        "8": "H"
                    }
                }

function main() {
    // console.log($("div"));
    $(".period").each(function(index, value) {
        var id = value.id.split('');
        var prd = colors[schedule[id[0]][id[1]]];
        var identifier = "#" + value.id;

        $(identifier).html('<div class="letter">' + schedule[id[0]][id[1]] + "</div>");
        $(identifier).css("background-color", colors[schedule[id[0]][id[1]]]);
    });
    $(".period").click(function(e) {
        periodID = $(this).attr("id");
    })
}