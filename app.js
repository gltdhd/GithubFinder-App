document.getElementById('searchUser').addEventListener('keydown', (e) => {
    // 엔터 키가 눌렸는지 확인
    if (e.key === "Enter") {
        const userText = e.target.value;

        if (userText !== '') {
            // GitHub API로 사용자 데이터 요청
            getUser(userText).then(data => {
                if (data.profile.message === 'Not Found') {
                    // 사용자를 찾을 수 없음
                    alert('해당하는 유저가 존재하지 않습니다.');
                } else {
                    // 프로필 정보와 리포지토리 정보 표시
                    showProfile(data.profile);
                    showRepositories(data.repos);
                }
            });
        }
    }
});




// GitHub API 호출 함수
async function getUser(user) {
    const profileReponse = await fetch(`https://api.github.com/users/${user}`);
    const repoResponse = await fetch(`https://api.github.com/users/${user}/repos`);

    const profile = await profileReponse.json();
    const repos = await repoResponse.json();

    return {
        profile,
        repos
    }
}

function showProfile(user) {
    const profileHTML = `
    <div class="card bg-white p-4 rounded-lg shadow flex flex-col items-center">
        <img class="rounded-full w-24 h-24" src="${user.avatar_url}" alt="User Avatar">
        <h3 class="text-xl font-bold mt-4">Name: ${user.name}</h3>
        <p class="text-gray-700">Bio: ${user.bio ? user.bio : 'N/A'}</p>
        <p class="text-gray-700">Location: ${user.location ? user.location : 'N/A'}</p>
        <p class="text-gray-700">Joined: ${new Date(user.created_at).toLocaleDateString()}</p>
        <div class="flex space-x-2 mt-3">
            <a href="${user.html_url}?tab=repositories" target="_blank" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-xs">Public Repos: ${user.public_repos}</a>
            <a href="${user.html_url}?tab=followers" target="_blank" class="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded text-xs">Followers: ${user.followers}</a>
            <a href="${user.html_url}?tab=following" target="_blank" class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-xs">Following: ${user.following}</a>
        </div>
        <a href="${user.html_url}" target="_blank" class="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            View Profile
        </a>
    </div>
    `;
    document.getElementById('profile').innerHTML = profileHTML;
}

// 리포지토리 정보 표시 함수
function showRepositories(repositories) {
    let repoHTML = '<h2 class="text-2xl font-bold mb-4">Recent Repositories</h2>';
    repositories.forEach(repo => {
        repoHTML += `
            <div class="repo mb-4 p-4 bg-white rounded-lg shadow">
                <h4 class="font-bold"><a href="${repo.html_url}" target="_blank" class="text-blue-500 hover:text-blue-700">${repo.name}</a></h4>
                <p class="text-gray-600">${repo.description}</p>
            </div>
        `;
    });
    document.getElementById('repositories').innerHTML = repoHTML;
}
