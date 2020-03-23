function ProductTable(props) {
  const productRows = props.products.map(product =>
  /*#__PURE__*/
  //id is taken as key value which uniquely identifies a row.
  React.createElement(ProductRow, {
    Key: product.id,
    product: product
  }));
  return /*#__PURE__*/React.createElement("table", {
    className: "bordered-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "color1"
  }, "Product Name"), /*#__PURE__*/React.createElement("th", {
    className: "color2"
  }, "Price"), /*#__PURE__*/React.createElement("th", {
    className: "color1"
  }, "Category"), /*#__PURE__*/React.createElement("th", {
    className: "color2"
  }, "Image"))), /*#__PURE__*/React.createElement("tbody", null, productRows));
}

function ProductRow(props) {
  const product = props.product;
  return /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, product.productname), /*#__PURE__*/React.createElement("td", null, "$", product.price), /*#__PURE__*/React.createElement("td", null, product.category), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("a", {
    href: product.image,
    target: "_blank"
  }, "View")));
}

class ProductAdd extends React.Component {
  constructor() {
    super(); //pre-populating the $ symbol

    this.state = {
      value: '$'
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  } // To read the price value using onChange.


  handleChange(e) {
    this.setState({
      value: e.target.reset
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.productAdd;
    const product = {
      productname: form.productname.value,
      price: form.price.value,
      category: form.category.value,
      image: form.image.value
    };
    this.props.createProduct(product);
    form.productname.value = "";
    form.price.value = '$';
    form.category.value = 'Shirts';
    form.image.value = "";
  }

  render() {
    return /*#__PURE__*/React.createElement("form", {
      name: "productAdd",
      onSubmit: this.handleSubmit
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "fleft"
    }, /*#__PURE__*/React.createElement("label", null, "Category"), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("select", {
      name: "category"
    }, /*#__PURE__*/React.createElement("option", null, "Shirts"), /*#__PURE__*/React.createElement("option", null, "Jeans"), /*#__PURE__*/React.createElement("option", null, "Jackets"), /*#__PURE__*/React.createElement("option", null, "Sweaters"), /*#__PURE__*/React.createElement("option", null, "Accessories"))), /*#__PURE__*/React.createElement("div", {
      className: "fleft"
    }, /*#__PURE__*/React.createElement("label", null, "Price Per Unit"), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("input", {
      type: "text",
      name: "price",
      value: this.state.value,
      onChange: this.handleChange
    })), /*#__PURE__*/React.createElement("div", {
      className: "fleft"
    }, /*#__PURE__*/React.createElement("label", null, "ProductName"), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("input", {
      type: "text",
      name: "productname"
    })), /*#__PURE__*/React.createElement("div", {
      className: "fleft"
    }, /*#__PURE__*/React.createElement("label", null, "Image Url"), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("input", {
      type: "url",
      name: "image"
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
      className: "color3"
    }, "Add Product"))));
  }

}

async function graphQLFetch(query, variables = {}) {
  try {
    const response = await fetch('http://localhost:3000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query,
        variables
      })
    });
    const result = await response.json();

    if (result.errors) {
      const error = result.errors[0];

      if (error.extensions.code == 'BAD_USER_INPUT') {
        const details = error.extensions.exception.errors.join('\n ');
        alert(`${error.message}:\n ${details}`);
      } else {
        alert(`${error.extensions.code}: ${error.message}`);
      }
    }

    return result.data;
  } catch (e) {
    alert(`Error in sending data to server: ${e.message}`);
  }
}

class ProductList extends React.Component {
  constructor() {
    super(); //assigning an empty array to the products state variable.

    this.state = {
      products: []
    }; // bind() method helps in passing eventhandlers and other functions as props to the child component.

    this.createProduct = this.createProduct.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    // constructing a GraphQL query
    const query = `query{
      productList{
          id productname price 
		  category image

      }
    }`;
    const data = await graphQLFetch(query);

    if (data) {
      this.setState({
        products: data.productList
      });
    }
  } //method to add a new product


  async createProduct(product) {
    const query = `mutation productAdd($product: ProductInputs!) {
      productAdd(product: $product) {
        id
      }
    }`;
    const data = await graphQLFetch(query, {
      product
    });

    if (data) {
      this.loadData();
    }
  }

  render() {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h1", null, "My Company Inventory"), /*#__PURE__*/React.createElement("p", null, "Showing all available products"), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(ProductTable, {
      products: this.state.products
    }), /*#__PURE__*/React.createElement("p", null, "Add a new product to inventory"), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(ProductAdd, {
      createProduct: this.createProduct
    }));
  }

}

const element = /*#__PURE__*/React.createElement(ProductList, null);
ReactDOM.render(element, document.getElementById('contents'));