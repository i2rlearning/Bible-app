      const versionList = document.querySelector(`#bible-version-list`);
      var selectVal = document.querySelector('#optVal').value;
      
      if (selectVal == 'language') {
           selectVal = 'https://api.scripture.api.bible/v1/bibles?include-full-details=false';
      }

      let versionHTML = ``;
 
      getBibleVersions().then((bibleVersionList) => {
        const sortedVersions = sortVersionsByLanguage(bibleVersionList);
      
      for (let languageGroup in sortedVersions) {
        const language = languageGroup;
        versionHTML += `<h4 class="list-heading"><span>${language}</span></h4><ul>`;
        const versions = sortedVersions[languageGroup];

        for (let version of versions) {
          versionHTML += `<li><a href="book.html?version=${version.id}&name=${version.name}&abbr=${version.abbreviation}">
                              <p>
                                <span class="bible-version-name"> <strong>${
                                  version.name
                                }</span></strong> 

                                ${
                                  version.description
                                    ? '<span class="bible-version-desc"><br /><strong>Description:</strong> ' +
                                      version.description +
                                      "</span>"
                                    : ""
                                } 

                               <br /><strong>Abbreviation:</strong> <span class="bible-version-abbr" title="${version.name}">${version.abbreviation}</span> 
                              </p> 
                            </a>
                          </li>`;
        }
        versionHTML += `</ul>`;
      }
      versionList.innerHTML = versionHTML;
    });
    

    function getBibleVersions() {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
    
        xhr.addEventListener(`readystatechange`, function () {
          if (this.readyState === this.DONE) {
            const { data } = JSON.parse(this.responseText);
            const versions = data.map((data) => {
              return {
                name: data.name,
                id: data.id,
                abbreviation: data.abbreviation,
                description: data.description,
                language: data.language.name,
              };
            });
    
            resolve(versions);
          }
        });

  
        //******* The below 3 URLs may be reconfigured on this page: https://scripture.api.bible/livedocs#/Bibles/getBible  *******                         
       // xhr.open(`GET`, 'https://api.scripture.api.bible/v1/bibles?include-full-details=false'); //All
       //   xhr.open(`GET`, 'https://api.scripture.api.bible/v1/bibles?language=eng&include-full-details=false'); //English 
      //  xhr.open(`GET`, `https://api.scripture.api.bible/v1/bibles?language=grc&include-full-details=false`); //Greek
      //  xhr.open(`GET`, 'https://api.scripture.api.bible/v1/bibles?ids=a8a97eebae3c98e4-01%2C%202c500771ea16da93-01%2C%200b262f1ed7f084a6-01&include-full-details=false'); //Hebrew
        
        
        xhr.open(`GET`, selectVal);

        xhr.setRequestHeader(`api-key`, API_KEY);
    
        xhr.onerror = () => reject(xhr.statusText);

        xhr.send();
      });
    }
    
   //************************************************************************
   // The below function is a helper to sort the Bible versions by language. 
   // This is by no means required, but it is a good demonstration of 
   //    how the API data can be sorted for different purposes. 
   //************************************************************************
   function sortVersionsByLanguage(bibleVersionList) {
    let sortedVersions = {};
  
    for (const version of bibleVersionList) {
      if (!sortedVersions[version.language]) {
        sortedVersions[version.language] = [];
      }
      sortedVersions[version.language].push(version);
    }
    for (const version in sortedVersions) {
      sortedVersions[version].sort((a, b) => {
        const nameA = a.abbreviation.toUpperCase();
        const nameB = b.abbreviation.toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
    }
    return sortedVersions;
  } 


