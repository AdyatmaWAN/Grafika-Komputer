const myMiniProject = [
    {
        "name": "Lab 1",
        "Type": "Lab",
    },
    {
        "name": "Worksheet 1",
        "Type": "Worksheet"
    },
]

const projectByType = [
    [
        "Lab",
        []
    ],
    [
        "Worksheet",
        []
    ],
]

function getLink(project) {
    const partialWord = project.split(" ")
    let link = ""

    for (word of partialWord) {
        link += word.toLowerCase() + "-"
    }
    link = link.slice(0, link.length-1)

    // Route to link
    window.location.href = link + "/index.html"
}

const projectList = document.querySelector("#projectList")

// Klasifikasikan subject berdasar tipe
for (Type of projectByType) {
    for (project of myMiniProject) {
        if (project.Type == Type[0]) {
            Type[1].push(project.name)
        }
    }
}

console.log(projectByType)

// Print HTML sesuai tipe
for (Type of projectByType) {
    console.log(Type)
    const monthTag = document.createElement('span')
    monthTag.className = "tag"
    monthTag.innerText = Type[0]
    const newLine = document.createElement('br')

    if (Type[1].length != 0) {
        // Ketika ada isinya maka tag tipe dibuat
        projectList.append(monthTag)
        projectList.append(newLine)

        for (project of Type[1]) {
            const ahref = document.createElement('a')
            ahref.src = project
            const boxx = document.createElement('div')
            boxx.className = "box is-me"
            boxx.innerText = project

            projectList.append(boxx)
        }
    }
}

setInterval(() => {
    const allMiniProject = document.querySelectorAll('div')

    for (miniProject of allMiniProject) {
        console.log(miniProject)
        if (miniProject.className == "box is-me") {
            miniProject.addEventListener('click', function () {
                console.log("EH")
                getLink(this.innerText)
            });
        }
    }

}, 1000)