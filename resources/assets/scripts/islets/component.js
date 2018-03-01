import Vue from 'vue';

export default Vue.extend({
	data: function() {
		return {
			manager: null,
			selected: false,
			module: {
				label: null,
				description: null,
				thumb: null
			}
		}
	},
	methods: {
		deselect: function() {
			if (!this.selected) {
				return;
			}

			this.selected = false;

			this.$el.classList.remove('is-selected');
			this.manager.selected--;
		},

		select: function() {
			if (this.selected) {
				return;
			}

			this.selected  = true;

      this.$el.classList.add('is-selected');
			this.manager.selected++;
		},

		toggleSelected: function() {
			if (this.selected) {
				this.deselect();
			} else {
				this.select();
			}
		}
	},
	computed: {
		label: function() {
			if (this.module.label) {
				return this.module.label;
			}

			switch(this.$el.nodeName) {
				case 'P': return 'Paragraph';
                case 'H1': return 'Heading';
				case 'UL': return 'Unordered List';
				case 'OL': return 'Ordered List';
				case 'DL': return 'Definition List';
				case 'DIV': return 'Division';
				case 'SECTION': return 'Section';
				default: return 'Unknown';
			}
		},

		summary: function() {
			return this.$el.innerText.slice(0, 60) + '...';
		},

		thumb: function() {
			if (this.module.thumb) {
				return this.module.thumb;
			}

			return 'http://via.placeholder.com/128x72?text=</>';
		}
	}
});
