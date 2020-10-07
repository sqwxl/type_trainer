const fs = require("fs")

fs.readFile("./layout_enfix.json", (err, data) => {
  let layout = JSON.parse(data)
  console.log(layout)
  //fs.writeFile("./shift.json", JSON.stringify(layout), 'utf8', () => {})
})
