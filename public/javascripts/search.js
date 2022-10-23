/* global instantsearch algoliasearch */
import { dontev } from "dotenv";
dontev.config();
import algoliasearch from "algoliasearch/lite";
import instantsearch from "instantsearch.js";
import { searchBox, hits } from "instantsearch.js/es/widgets";

const { ALGOLIA_APP_ID, ALGOLIA_API_KEY, ALGOLIA_INDEX_NAME } = process.env;

const searchClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);

const search = instantsearch({
  indexName: ALGOLIA_INDEX_NAME,
  searchClient,
});

search.addWidgets([
  searchBox({
    container: "#searchbox",
  }),
  instantsearch.widgets.stats({
    container: "#stats",
  }),
  instantsearch.widgets.clearRefinements({
    container: "#clear-refinements",
  }),
  instantsearch.widgets.refinementList({
    container: "#genre-list",
    attribute: "genre",
  }),
  instantsearch.widgets.hits({
    container: "#hits",
    templates: {
      item: `
                  <div class="product">
                    <div class="imgs-product">
                      <img src="/images/IMG_bg.avif" alt="background" class="img-bg">
                      <img src="{{image}}" class="img-fluid img-product" alt="{{name}}" />
                      <img src="/images/clip-front.png" alt="clips" class="img-front">
                      <!--overlay on hover-->
                      <div class="overlay">
                        <div class="overlay-btn">
                          <div>
                            <button class="circle-btn like__btn" data-post-id="{{objectID}}">
                              <span id="icon"><i class="fa fa-solid fa-heart"></i></span>
                            </button>
                            <span id="likes-{{objectID}}">{{likes}}</span> 
                          </div>
                          <a href="/add-to-cart/{{objectID}}" class="no-highlight">
                            <button type="button" class="circle-btn" id="cart-btn">
                            <i class="fa fa-solid fa-cart-plus"></i>
                            </button>
                          </a>
                        </div>
                        <!--image-->
                        <a href="product/{{objectID}}" class="img-fluid img-product">
                          <img src="{{image}}" class="img-href" alt="{{name}}"/>
                        </a>
                      </div>
                    </div>
                    <div class="card-info">
                      <a class="hit-name" href="product/{{objectID}}">

                        <div >
                        {{#helpers.highlight}}{ "attribute": "name" }{{/helpers.highlight}}
                      </div>

                      </a>
                      <a href="../{{artist}}">
                      <div class="artist-text">
                      <i class="far fa-regular fa-user"></i> {{#helpers.highlight}}{ "attribute": "artist" }{{/helpers.highlight}}
                      </div>
                      </a>
                        <a href="product/{{objectID}}" class="no-highlight">
                          <div class="hit-price">
                          <span class="egp">EGP</span>
                          <span class="price-no">{{price}}</span>
                          </div>
                        </a>
                    </div>
                  </div>
        `,
    },
  }),
  instantsearch.widgets.pagination({
    container: "#pagination",
  }),
]);

search.start();
