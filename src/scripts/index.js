import { user } from "../scripts/services/user.js"
import { repositories } from "../scripts/services/repositories.js"
import { events } from "./services/events.js"

document.getElementById('btn-search').addEventListener('click', () => {
    const userName = document.getElementById('input-search').value
    getUserProfile(userName)
    getUserSocial(userName)
    getUserRepositories(userName)
    getUserEvents(userName)
})

document.getElementById('input-search').addEventListener('keyup', (e) => {
    const userName = e.target.value
    const key = e.which || e.keyCode
    const isEnterKeyPressed = key === 13

    if (isEnterKeyPressed) {
        getUserProfile(userName)
        getUserRepositories(userName)
    }
})

function getUserProfile(userName) {
    user(userName).then(userData => {
        let userInfo = `<div class="info">
                        <img src="${userData.avatar_url}" alt="Foto do perfil do usuário" />
                        <div class = "data">
                        <h1>${userData.name ?? 'Não possui nome cadastrado'}</h1>
                        <p>User: ${userName ?? 'Não possui nome cadastrado'}</h1>
                        <p>Bio: ${userData.bio ?? 'Não possui bio cadastrada'}</p>
                        </div>
                        </div>`

        document.querySelector('.profile-data').innerHTML = userInfo
    })
}

function getUserSocial(userName) {
    user(userName).then(userData => {
        let userSocial =    `<div class='social'>
                                <div>
                                <i class="fa-solid fa-user-group"></i>
                                <a target="_blank" href="https://github.com/${userData.login}?tab=followers">Seguidores: ${userData.followers}</a>
                                <a target="_blank" href="https://github.com/${userData.login}?tab=following">Seguindo: ${userData.following}</a>
                                </div>
                                <img src="https://github-readme-stats.vercel.app/api?username=${userData.login}&show_icons=true&theme=tokyonight&include_all_commits=true&count_private=true"/>
                                <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=${userData.login}&layout=compact&langs_count=6&theme=tokyonight"/>
                            </div>`
        document.querySelector('.profile-data').innerHTML += userSocial
    })
}

function getUserRepositories(userName) {
    repositories(userName).then(reposData => {
        let repositoriesItens = ""

        reposData.forEach(repo => {
            repositoriesItens += `  <li><a href="${repo.html_url}" target="_blank">${repo.name}
                                    <div class "repo-stats">
                                    <span><i class="fa-solid fa-code-fork"></i> ${repo.forks}</span>
                                    <span><i class="fa-regular fa-star"></i> ${repo.stargazers_count}</span>
                                    <span><i class="fa-solid fa-eye"></i> ${repo.watchers}</span>
                                    <span><i class="fa-solid fa-code"></i> ${repo.language}</span>
                                    </div></a>
                                    </li>`
        })

        document.querySelector('.profile-data').innerHTML += `<div class="repositories section">
                                                            <h2>Repositórios</h2>
                                                            <ul>${repositoriesItens}</ul>
                                                            </div>`
    })
    console.log(repositories('cadudias'))
}

function getUserEvents(userName) {
    events(userName).then(eventData => {
        let userEvents = ""
        eventData.forEach(lastEvent => {
            let dataHora = new Date(lastEvent.created_at)
            let dataFormatada = dataHora.toLocaleDateString('pt-BR', {day:'2-digit', month: '2-digit', year: '2-digit'})
            let horaFormatada = dataHora.toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})
            let nomeRepo = lastEvent.repo.name.split('/')[1]
            let tipoEvent = lastEvent.type.split("Event")[0]
            let descriptionEvent = ""

            if(tipoEvent == "Push"){
                descriptionEvent = lastEvent.payload.commits[0].message
            }else{
                descriptionEvent = "Usuário criou repositório"
            }

            userEvents +=   `<tr>
                            <td><a target="_blank" href="https://github.com/${lastEvent.repo.name}">${dataFormatada}<br>${horaFormatada}</a></td>
                            <td><a target="_blank" href="https://github.com/${lastEvent.repo.name}">${tipoEvent}</a></td>
                            <td><a target="_blank" href="https://github.com/${lastEvent.repo.name}">${nomeRepo}</a></td>
                            <td><a target="_blank" href="https://github.com/${lastEvent.repo.name}/commits">${descriptionEvent}</a></td>
                            </tr>`
        })
        document.querySelector('.profile-data').innerHTML += `<div class="events section">
                                                            <h2>Últimos eventos</h2>
                                                            <table>
                                                            <tr>
                                                                <th>Dia/hora</th>
                                                                <th>Ação</th>
                                                                <th>Repositório</th>
                                                                <th>Descrição</th>
                                                            </tr>
                                                            ${userEvents}
                                                            </table>
                                                            </div>`
    })
}