let menuIcon=document.querySelector('#menu-icon');
let navbar=document.querySelector('.navbar');

menuIcon.onclick=()=>{
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
};


let sections=document.querySelectorAll('section');
let navLinks=document.querySelectorAll('header nav a');

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if(top >= offset && top < offset + height){
            navLinks.forEach(links => {
                links.classList.remove('active');
                document.querySelector('header nav a[href*=' + id + ']').classList.add('active');
            });
        };

    });
    let header=document.querySelector('header');

    header.classList.toggle('sticky',window.screenY>100);
    menuIcon.classList.remove('bx-x');
    navbar.classList.remove('active');
};

ScrollReveal({
    //reset:true,
    distance:'80px',
    duration:2000,
    delay:200
});

ScrollReveal().reveal('.home-content,.heading',{origin:'top'});
ScrollReveal().reveal('.home-img,.services-container,.portfolio-container,.contact form',{origin:'bottom'});
ScrollReveal().reveal('.home-content h1,.about-img',{origin:'left'});
ScrollReveal().reveal('.home-content p,.about-content',{origin:'right'});

const typed = new Typed('.multiple-text',{
    strings:['Fullstack Developer'],
    typeSpeed:150,
    backDelay:1000,
    loop:false
});


const username = "HenriqueDavid-M";
const apiUrl = `https://api.github.com/users/${username}/repos`;

async function obterInformacoesProjetos() {
  try {
    const response = await fetch(apiUrl);
    const repos = await response.json();

    const githubProjectsContainer = document.getElementById('github-projects-container');

    for (const repo of repos) {
      try {
        const ppFileUrl = `https://raw.githubusercontent.com/${username}/${repo.name}/main/PP.txt`;
        const ppFileResponse = await fetch(ppFileUrl);

        let ppFileContent;

        try {
          // Tentar converter a resposta para texto
          ppFileContent = await ppFileResponse.text();

          // Limpar a string, se for uma string
          if (typeof ppFileContent === 'string') {
            ppFileContent = ppFileContent.trim();
          }
        } catch (error) {
          // Se ocorrer um erro ao converter para texto, tratar como JSON
          ppFileContent = await ppFileResponse.json();
        }

        // Verificar se o conteúdo do PP.txt é uma URL de imagem
        const isImageUrl = /^(http|https):\/\/[^ "]+$/.test(ppFileContent);

        if (isImageUrl) {
          // Criar um elemento de projeto
          const projectBox = document.createElement('div');
          projectBox.className = 'portfolio-box';

// Adicionar a imagem e informações ao projeto
projectBox.innerHTML = `
  <img src="${ppFileContent}" alt="Imagem do projeto ${repo.name}">
  <div class="portfolio-layer">
      <h4>${repo.name}</h4>
      <p>${repo.description || 'Sem descrição disponível.'}</p>
      <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="project-link"><i class='bx bx-link-external'></i></a>
  </div>`;

// Adicionar evento de clique para redirecionar para o repositório
projectBox.addEventListener('click', () => {
  window.open(repo.html_url, '_blank');
});

          // Adicionar o projeto ao contêiner
          githubProjectsContainer.appendChild(projectBox);
        } else {
          console.warn(`Conteúdo inválido no arquivo PP.txt do repositório ${repo.name}. Deve ser uma URL de imagem.`);
        }
      } catch (error) {
        console.error(`Erro ao processar o repositório ${repo.name}:`, error);
      }
    }
  } catch (error) {
    console.error("Erro ao obter repositórios do GitHub:", error);
  }
};
// Chamar a função para iniciar o processo
obterInformacoesProjetos();

function submitForm() {
  var formData = {
      Name: document.getElementsByName("Name")[0].value,
      Email_Address: document.getElementsByName("Email_Address")[0].value,
      Mobile_Number: document.getElementsByName("Mobile_Number")[0].value,
      Email_Subject: document.getElementsByName("Email_Subject")[0].value,
      Your_Message: document.getElementById("yourMessage").value
  };

  fetch('https://api.sheetmonkey.io/form/potuzJDTLCWZC59FuFKDtZ', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.text(); // Mudamos de .json() para .text() aqui
  })
  .then(data => {
      console.log('Success:', data);

      // Tentar ajustar a resposta para que seja um JSON válido
      try {
          // Verificar se a resposta parece ser um JSON válido
          if (!isJSONString(data)) {
              // Se não for um JSON válido, tentar ajustá-lo (substitua '<' por '{')
              data = data.replace('<', '{');
          }

          // Tentar analisar a resposta como JSON novamente
          const jsonData = JSON.parse(data);

          // Verificar se a resposta é um JSON válido
          if (isValidJSON(jsonData)) {
              // Aqui você pode processar jsonData conforme necessário
              // Exemplo: Se houver uma mensagem de sucesso, exibir uma mensagem
              if (jsonData.success) {
                  document.getElementById("successMessage").style.display = "block";
              }
          } else {
              throw new Error('A resposta não é um JSON válido');
          }
      } catch (error) {
          console.error('Error:', error);
          // Exibir uma mensagem de sucesso mesmo em caso de erro
          document.getElementById("successMessage").style.display = "block";
      }
  })
  .catch((error) => {
      console.error('Error:', error);
      // Exibir uma mensagem de sucesso mesmo em caso de erro
      document.getElementById("successMessage").style.display = "block";
  });
}

function isValidJSON(jsonData) {
  return jsonData && typeof jsonData === 'object' && !Array.isArray(jsonData);
}

function isJSONString(str) {
  try {
      JSON.parse(str);
      return true;
  } catch (error) {
      return false;
  }
}