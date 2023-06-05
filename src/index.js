import { fetchBreeds, fetchCatByBreed } from './cat-api.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SlimSelect from 'slim-select';

const refs = {
  select: document.querySelector('.breed-select'),
  catInfo: document.querySelector('.cat-info'),
  loader: document.querySelector('.loader-container'),
};

const condition = {
  hide(element) {
    element.classList.add('is-hidden');
  },
  show(element) {
    element.classList.remove('is-hidden');
  },
};

const slimSelect = new SlimSelect({
  select: refs.select,
  settings: {
    allowDeselect: true,
  },
});

refs.select.addEventListener('change', onSelectChange);

function onSelectChange() {
  const breedId = refs.select.value;

  condition.hide(refs.catInfo);
  condition.show(refs.loader);

  fetchCatByBreed(breedId)
    .then(createCatInfoMarkup)
    .catch(onErorr)
    .finally(() => {
      condition.hide(refs.loader);
    });
}

condition.hide(refs.select);
condition.show(refs.loader);

fetchBreeds()
  .then(data => {
    createSelectOptionMarkup(data);

    condition.show(refs.select);
    condition.hide(refs.loader);
  })
  .catch(() => {
    onErorr();
    condition.hide(refs.loader);
  });

function createSelectOptionMarkup(data) {
  slimSelect.setData(data.map(({ id, name }) => ({ value: id, text: name })));
}

function createCatInfoMarkup(data) {
  const markup = data
    .map(
      catInfo => `
      <div class="cat-img">
        <img src="${catInfo.url}" alt="${catInfo.breeds[0].name}" />
      </div>
      <div class="cat-desc">
        <h1>${catInfo.breeds[0].name}</h1>
        <p>${catInfo.breeds[0].description}</p>
        <p><b>Temperament:</b> ${catInfo.breeds[0].temperament}</p>
      </div>
      `
    )
    .join('');

  refs.catInfo.innerHTML = markup;

  condition.show(refs.catInfo);
}

function onErorr() {
  Notify.failure('Oops! Something went wrong! Try reloading the page!');
}
