
<ul id="actions">
    <li v-for="item in actions"
        v-on:click="click"
        :data-name="item.name"
        :title="item.tooltip">
    </li>
</ul>

<div class="islet manager">
    <div class="toolbar">
        <button v-if="!container || sorting || view == 'add' || view == 'remove'" class="disabled parent">Parent</button>
        <button v-if="container && !sorting && view != 'add' && view != 'remove'" class="parent" v-on:click="focus(container.parentNode)">Parent</button>

        <button v-if="!container || selected || view == 'add' || view == 'remove'" class="disabled add">Add</button>
        <button v-if="container && !selected && view != 'add' && view != 'remove'" class="add" v-on:click="show('add')">Add</button>

        <button v-if="view != 'list' || !selected || sorting" class="disabled remove">Remove</button>
        <button v-if="view == 'list' && selected && !sorting" class="remove" v-on:click="show('remove')">Remove</button>
    </div>
    <div class="tools">
        <div v-bind:class="{ active: view == 'help' }" class="help">
            <div v-if="!container" class="message">
                <p>
                    No editable content is currently selected.  Please choose one of the following content areas to begin:
                </p>
                <ul>
                    <li class="islet" v-for="islet in islets" v-on:mouseover="highlight(islet)" v-on:click="focus(islet)">{{ islet.getAttribute('data-islet') }}</li>
                </ul>
            </div>
            <div v-if="container" class="message">
                <p>
                    The selected element has no components, click the 'plus' icon above to see what's available.  or click the 'arrow' icon to jump up to the parent container.
                </p>
            </div>
        </div>
        <div v-bind:class="{ active: view == 'list' }" class="list">
            <ol>
                <li v-bind:class="{ selected: component.selected }" v-for="component in components" v-on:dragend="sort(component)" v-on:dragstart="sort(component)" v-on:click="select(component, $event)" v-on:dblclick="focus(component.node)">
                    <h1 v-if="canFocus(component.node)" title="Click to select or deselect.  Double click to manage its interior elements.">{{ component.label }} <span >↴</span></h1>
                    <h1 v-if="!canFocus(component.node)" title="Click to select or deselect this element for removal.">{{ component.label }}</h1>
                    <div class="preview">
                        <img class="thumb" :src="component.thumb" />
                        <span class="content">{{ component.summary }}</span>
                    </div>
                    <span class="handle">☰</span>
                </li>
            </ol>
        </div>
        <div v-bind:class="{ active: view == 'add' }" class="add">
            <ol>
                <li v-for="module in modules" v-on:click="add(module, $event)">
                    <h1>{{ module.label }}</h1>
                    <div class="preview">
                        <img class="thumb" :src="module.thumb" />
                        <span class="description">{{ module.description }}</span>
                    </div>
                </li>
            </ol>
        </div>
        <div v-bind:class="{ active: view == 'remove' }" class="remove">
            <div class="message">
                <p>
                    Are you sure you want to remove the selected element(s)?
                </p>
                <p>
                    <button class="yes" v-on:click="remove">Yes</button>
                    <button class="no" v-on:click="show('list')">No</button>
                </p>
            </div>
        </div>
    </div>
</div>

<link href="/assets/lib/alloy-editor/assets/alloy-editor-ocean-min.css" rel="stylesheet">
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/sortablejs@1.6.1/Sortable.min.js"></script>
<script src="/assets/lib/alloy-editor/alloy-editor-all-min.js"></script>
<script type="text/javascript" src="/assets/scripts/admin.js"></script>
