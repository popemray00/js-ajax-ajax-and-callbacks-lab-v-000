$(document).ready(function (){

});
function searchRepositories() {
  let searchTerms = $("input#searchTerms").val().replace(" ", "+");
  const requestString = 'https://api.github.com/search/repositories?q=' + searchTerms;
  $.get(requestString).done(function(data) {
    console.log(data)
    const repos = data.items;
    showRepositories(repos);
  }).fail(function(error) {
    displayError(error);
    console.log('Something went wrong: ' + error);
  })
}

function showRepositories(data) {
  const repoList = '<ul>' + data.map(r => {
    return (`
      <li><h2><a href="${r.html_url}">${r.name}</a></h2>
      <section>
        <header><h4>Created By ${r.owner.login}</h4></header>
        <img src="${r.owner.avatar_url}" height="32" width="32">
      </section>
      <p>${r.description}</p>
      <p><a href="#" data-commits_url="${r.commits_url}" data-repository="${r.name}" data-owner="${r.owner.login}" onclick="showCommits(this)">Show Commits</a></p>
      </li>
    `)
  }).join('') + "</ul>"

  $("div#results").html(repoList);
}

function displayError(error) {
  $("div#errors").html("${error}");
}

function showCommits(el) {
  const requestString = 'https://api.github.com/repos/' + el.dataset.owner + '/' + el.dataset.repository + '/commits';
  $.get(requestString).done(function(data) {
    console.log(data)
    const commitsList = '<ul>' + data.map(c => {
      return (`
        <li><h2>${c.sha}</h2>
        <p>Author: ${c.author.login}</p>
        <p>Committer Author Name: ${c.commit.author.name}</p>
        <img src="${c.author.avatar_url}" height="32" width="32">
        </li>
      `)
    }).join('') + "</ul>"

    $("div#details").html(commitsList);

  }).fail(function(error) {
    displayError(error);
    console.log('Something went wrong: ' + error);
  })
}
