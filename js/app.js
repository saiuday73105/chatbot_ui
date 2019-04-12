{
  'use strict';
  let structure = {
      'menu': [
        {
          'title': 'Feedback',
          'id': 'feedback',
          'submenu': [
            {
              'title': '&#x1F44D;',
              'id': 'p1'
            },
            {
              'title': '&#x1F44E;',
              'id': 'p2'
            }
          ]
        },
        {
          'title': 'Documents',
          'id': 'documents',
          'submenu': [
            {
              'title': 'Previous Documents',
              'id': 'previous'
            },
            {
              'title': 'Upload a new one',
              'id': 'upload'
            }
          ]
        },
        {
          'title': 'Query',
          'id': 'query',
          'submenu': [
            {
              'title': 'New Query',
              'id': 'new'
            },
          ]
        }
      ]
    },
    idle,
    idletime = 45000;
  const chat = document.querySelector('.chat');
  const content = document.querySelector('.content');

  const newMessage = (message, type = 'user') => {
    let bubble = document.createElement('li'),
      slideIn = (el, i) => {
        setTimeout(() => {
          el.classList.add('show');
        }, i * 150 ? i * 150 : 10);
      },
      scroll,
      scrollDown = () => {
        chat.scrollTop += Math.floor(bubble.offsetHeight / 18);
      };
    bubble.classList.add('message');
    bubble.classList.add(type);
    bubble.innerHTML = type === 'user' ? `<nav>${message}</nav>` : `<p>${message}</p>`;
    chat.appendChild(bubble);

    scroll = window.setInterval(scrollDown, 16);
    setTimeout(() => {
      window.clearInterval(scroll);
      chat.scrollTop = chat.scrollHeight;
    }, 300);

    setTimeout(() => {
      bubble.classList.add('show');
    }, 10);

    if (type === 'user') {
      let animate = chat.querySelectorAll('button:not(:disabled)');
      for (let i = 0; i < animate.length; i += 1) {
        slideIn(animate[i], i);
      }
      bubble.classList.add('active');
    }
  };
  };

  const init = () => {
    let welcomeReplies = [
      'Hello! &#x1F44B; I\'m a bot here to help you answer your queries regarding the document.'
    ];
    idle = window.setInterval(() => {
      window.clearInterval(idle);
      checkUp();
    }, idletime);
    newMessage(randomReply(welcomeReplies), 'bot');
    setTimeout(() => {
      let startReplies = [
        'Continue &#x1F440;',
      ];
      newMessage(`<button class="choice start">${randomReply(startReplies)}</button>`);
    }, 300);
  };

  const makeUserBubble = el => {
    el.parentNode.parentNode.classList.add('selected');
    el.parentNode.parentNode.classList.remove('active');
    el.parentNode.parentNode.innerHTML = `<p>${el.textContent}</p>`;
  };

  const showMenu = again => {
    let menu = '',
      goBack = chat.querySelector('button.newmenu'),
      replies = [
        'What would you like to know more about? &#x1F4A1;',
        'Can I interest you in any of this? &#x1F4AF;',
        'Select something of the following... &#x1F447;'
      ];
    if (goBack) {
      makeUserBubble(goBack);
    }
    setTimeout(() => {
      again ? newMessage(randomReply(againReplies), 'bot') : newMessage(randomReply(replies), 'bot');
      structure.menu.forEach((val, index) => {
        menu += `<button class="choice menu" data-submenu="${index}">${val.title}</button>`;
      });
      setTimeout(() => {
        newMessage(menu);
      }, 300);
    }, 500);
    idle = window.setInterval(() => {
      window.clearInterval(idle);
      checkUp();
    }, idletime);
  };

  const menuClick = clicked => {
    let submenu = '',
      menuChoice = structure.menu[clicked.getAttribute('data-submenu')],
      userReplies = [
        'Show me the menu again &#x1F60B;'
      ];
    menuChoice.submenu.forEach(val => {
      let id = `${menuChoice.id}-${val.id}`;
      submenu += `<button class="choice submenu" aria-controls="${id}" data-content="${id}">${val.title}</button>`;
    });
    submenu += `<br /><button class="choice submenu newmenu">${randomReply(userReplies)}</button>`;
    setTimeout(() => {
      newMessage(randomReply(replies), 'bot');
      setTimeout(() => {
        newMessage(submenu);
      }, 300);
    }, 500);
  };

  const toggleContent = article => {
    let buttons = chat.querySelectorAll('button');
    if (article) {
      article.classList.add('show');
      chat.setAttribute('aria-hidden', 'true');
      content.setAttribute('aria-hidden', 'false');
      content.tabIndex = '0';
      content.focus();
    } else {
      content.setAttribute('aria-hidden', 'true');
      content.tabIndex = '-1';
      chat.setAttribute('aria-hidden', 'false');
      if (history.state && history.state.id === 'content') {
        history.back();
      }
      setTimeout(() => {
        let active = document.querySelector('.content article.show');
        if (active) {
          active.classList.remove('show');
          chat.querySelector(`button[data-content="${active.id}"]`).focus();
        }
      }, 300);
    }
    for (let i = 0; i < buttons.length; i += 1) {
      buttons[i].tabIndex = article ? '-1' : '0';
    }
  };

  const subMenuClick = clicked => {
    if (clicked.classList.contains('newmenu')) {
      showMenu(true);
    } else {
      toggleContent(document.getElementById(clicked.getAttribute('data-content')));
      history.pushState({'id': clicked.getAttribute('data-content')}, '', `#${clicked.getAttribute('data-content')}`);
    }
  };

  document.addEventListener('click', e => {
    if (e.target.classList.contains('choice')) {
      window.clearInterval(idle);
      if (!e.target.classList.contains('submenu')) {
        makeUserBubble(e.target);
      }

      if (e.target.classList.contains('menu')) {
        menuClick(e.target);
      }

      if (e.target.classList.contains('submenu')) {
        subMenuClick(e.target);
      }

      if (e.target.classList.contains('start')) {
        showMenu();
      }

      if (e.target.classList.contains('showmenu')) {
        showMenu(true);
      }
    }
    if (e.target.classList.contains('close')) {
      e.preventDefault();
      history.back();
    }
  });

  document.addEventListener('keydown', e => {
    if (e.keyCode === 27 && content.getAttribute('aria-hidden') === 'false') {
      history.back();
    }
  });

  window.addEventListener('popstate', e => {
    toggleContent(e.state && e.state.id && document.getElementById(e.state.id) ? document.getElementById(e.state.id) : '');
  });

  setTimeout(() => {
    init();
  }, 500);

  if (document.getElementById(window.location.hash.split('#')[1])) {
    let contentId = window.location.hash.split('#')[1];
    history.replaceState('', '', '.');
    setTimeout(() => {
      toggleContent(document.getElementById(contentId));
      history.pushState({'id': contentId}, '', `#${contentId}`);
    }, 10);
  }
}
