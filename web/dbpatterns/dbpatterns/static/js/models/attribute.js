dbpatterns.models.Attribute = Backbone.Model.extend({

    FOREIGN_KEY_SEPARATOR: "_",

    defaults: {
        "type": "string"
    },
    initialize: function () {
        this.detect_foreign_key();
        this.on("fk_does_not_exist", this.invoke_foreign_key, this);
        this.on("change:name", this.detect_foreign_key, this);
    },
    destroy: function () {
        this.collection.remove(this);
    },
    save: function () {
        this.collection.trigger("persist");
    },
    detect_foreign_key: function () {
        var tokens = this.get("name").split(this.FOREIGN_KEY_SEPARATOR);
        if (tokens.length > 1 && this.get("is_foreign_key") === undefined) {
            var entity_name = tokens.slice(0, -1).join(this.FOREIGN_KEY_SEPARATOR);
            var attribute_name = tokens.slice(-1)[0];
            this.set({
                "is_foreign_key": true,
                "foreign_key_entity": entity_name,
                "foreign_key_attribute": attribute_name
            }).on("render", this.trigger.bind(this, "connect"));
        }
    },
    invoke_foreign_key: function () {
        this.set({
            "is_foreign_key": false,
            "foreign_key_entity": "",
            "foreign_key_attribute": ""
        });
    }
});

dbpatterns.collections.Attribute = Backbone.Collection.extend({
    model: dbpatterns.models.Attribute,
    comparator: function (attribute) {
        return attribute.get("order");
    }
});