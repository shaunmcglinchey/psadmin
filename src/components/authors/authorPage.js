"use strict";

var React = require('react');
var AuthorApi = require('../../api/authorApi');

var Authors = React.createClass({
    getInitialState: function() {   // lifecycle method
        return {
            authors: []
        };
    },

    componentWillMount: function() {    // lifecycle method
        this.setState({ authors: AuthorApi.getAllAuthors() });
    },

    render: function() {
        var createAuthorRow = function(author) {
            return (  // common key is a unique key, a primary key from a db
                <tr key={author.id}>
                    <td><a href={"/#authors/" + author.id}>{author.id}</a></td>
                    <td>{author.firstName} {author.lastName}</td>
                </tr>
            );
        };

        return (
            <div>
                <h1>Authors</h1>

                <table className="table">
                    <thead>
                        <th>ID</th>
                        <th>Name</th>
                    </thead>
                    <tbody>
                        {this.state.authors.map(createAuthorRow, this)}
                    </tbody>
                </table>
            </div>
        );
    }
});

module.exports = Authors;