'use strict';

var STORAGE_KEY = 'todo-vuejs';
var localStorage;
var todoStorage = {
	fetch: function() {
		var todos = JSON.parse( localStorage.getItem(STORAGE_KEY) || '[]');
		todos.forEach(function(todo, index) {
			todo.id = index;
		});
		todoStorage.uid = todos.length;
		return todos;
	},
	save: function(todos) {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
	}
};


var todo = new Vue({
	el: '#todo',
	data: {
		todos: [],
		options: [
			{ value: -1, label: 'すべて' },
			{ value: 0, label: '作業中' },
			{ value: 1, label: '完了' }
		],
		current: -1
	},
	computed: {
		computedTodos: function(){
			return this.todos.filter(function(el){
				return this.current < 0 ? true : this.current === el.state;
			},this);
		},
		labels: function(){
			return this.options.reduce(function (a, b) {
				return Object.assign(a, { [b.value]: b.label });
			}, {});
		}
	},
	watch: {
		todos: {
			handler: function(todos){
				todoStorage.save(todos);
			},
			deep: true
		}
	},
	created: function() {
		this.todos = todoStorage.fetch();
	},
	methods: {
		doAdd: function(){
			var comment = this.$refs.comment;
			var date = new Date();
			var nowMonth = date.getMonth() + 1;
			var nowDate = date.getDate();

			if(!comment.value.length){
				return;
			}

			this.todos.push({
				id: todoStorage.uid++,
				comment: comment.value,
				state: 0,
				date: nowMonth + '/' + nowDate
			});
			comment.value = '';
		},
		doChangeState: function(item){
			item.state = item.state ? 0 : 1;
		},
		doRemove: function(item){
			var index = this.todos.indexOf(item);
			this.todos.splice(index, 1);
		}

	}
});
