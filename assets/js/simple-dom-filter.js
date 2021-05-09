class SimpleDomFilter {

    currentFilter = '';
    singleFilter = true;
    useStyleForHiding = false;

    filterSelector = ".filter-button"
    filterDataAttribute = "data-filter-categories"

    itemSelector = ".filter-item"
    itemDataAttribute = "data-filter-categories"

    constructor(options) {

        const self = this;

        self.currentFilter = (options && 'currentFilter' in options) ? options.currentFilter : self.currentFilter;
        self.singleFilter = (options && 'singleFilter' in options) ? options.singleFilter : self.singleFilter;
        self.useStyleForHiding = (options && 'useStyleForHiding' in options) ? options.useStyleForHiding : self.useStyleForHiding;
        self.filterSelector = (options && 'filterSelector' in options) ? options.filterSelector : self.filterSelector;
        self.filterDataAttribute = (options && 'filterDataAttribute' in options) ? options.filterDataAttribute : self.filterDataAttribute;
        self.itemSelector = (options && 'itemSelector' in options) ? options.itemSelector : self.itemSelector;
        self.itemDataAttribute = (options && 'itemDataAttribute' in options) ? options.itemDataAttribute : self.itemDataAttribute;

        const filterButtons = document.querySelectorAll(`${self.filterSelector}[${self.filterDataAttribute}]`);

        const onClick = (ev) => {
            const el = ev.target;
            const selection = el.attributes[self.filterDataAttribute].value;
            self.filter(selection);
        };

        filterButtons.forEach(el => {
            el.addEventListener("click", onClick, false)
        });

        self.filter(self.currentFilter);
    }

    _getCategories(categoryString) {
        if (!categoryString) return [];

        return categoryString
            .split(',')
            .map(value => value.replace(/^\s*|\s*$/, ''));
    }

    _toCategoriesString(categoryArray) {
        return categoryArray.join(', ');
    }

    _isMatch(elementCategories /* array */, filter /* array */) {
        if (filter.length == 0)
            return true;

        return elementCategories.some(elCat =>
            filter.some(filterCat => filterCat == elCat)
        );
    }

    filter(selection) {
        const self = this;

        const selectionCategories = self._getCategories(selection);
        const currentFilterCategories = self._getCategories(self.currentFilter);

        //
        // set new current filter
        let newFilterCategories;

        if (selectionCategories.length == 0) {
            newFilterCategories = [];
        }
        else if (self.singleFilter) {
            newFilterCategories = selectionCategories;
        } else {
            newFilterCategories = currentFilterCategories;

            selectionCategories.forEach(newCategory => {
                const exists = newFilterCategories.some(currentCategory => currentCategory == newCategory);
                if (!exists) { newFilterCategories.push(newCategory); }
                else { newFilterCategories = newFilterCategories.filter(i => i != newCategory); }
            });
        }

        self.currentFilter = self._toCategoriesString(newFilterCategories);

        //
        // update buttons
        const filterButtons = document.querySelectorAll(`${self.filterSelector}[${self.filterDataAttribute}]`);

        filterButtons.forEach(el => {
            const categories = self._getCategories(el.attributes[self.filterDataAttribute].value);
            const match = self._isMatch(categories, newFilterCategories);
            if (match) el.classList.add('active');
            else el.classList.remove('active');
        });

        //
        // update items
        const filterItems = document.querySelectorAll(`${self.itemSelector}[${self.itemDataAttribute}]`);

        let hide = [];
        let show = [];

        filterItems.forEach(el => {
            const categories = self._getCategories(el.attributes[self.itemDataAttribute].value);
            const match = self._isMatch(categories, newFilterCategories);
            if (match) show.push(el);
            else hide.push(el);
        });

        show.forEach(el => el.classList.remove('hidden'))
        hide.forEach(el => el.classList.add('hidden'))

    }

}
