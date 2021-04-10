import React from "react";

import { Badge, Button, createStyles, Theme, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { ProductsApi, ProductViewModel } from "../../types";

import { Status } from "../Status";

import { useAppContext } from "../../../AppContext";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    flex: {
      display: "flex",
    },
    flexGrow: {
      flexGrow: 1,
      margin: "auto",
    },
    item: {
      display: "flex",
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    infoDisplay: {
      borderTop: "1px solid #CCCCCC",
    },
    infoSubDisplay: {
      [theme.breakpoints.down("sm")]: {
        marginTop: theme.spacing(1),
      },
      [theme.breakpoints.up("sm")]: {
        marginTop: theme.spacing(2),
      },
    },
  })
);

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

export const Cart: React.FC = () => {
  const classes = useStyles();

  const { order } = useAppContext();

  const [error, setError] = React.useState("");
  const [processing, setProcessing] = React.useState(false);
  const [products, setProducts] = React.useState<Array<ProductViewModel>>([]);
  const [subTotal, setSubTotal] = React.useState(0);

  React.useEffect(() => {
    const getProducts = async () => {
      setProcessing(true);
      setProducts([]);
      if (order.productCounts && order.productCounts.size !== 0) {
        const api = new ProductsApi("");
        order.productCounts.forEach(async (productCount, productId) => {
          const [ret, err] = await api.readItem(productId);
          if (ret) {
            setProducts((prevState) => [...prevState, ret]);
          } else {
            setError(err);
          }
        });
      }
      setProcessing(false);
    };
    getProducts().then();
  }, [order]);

  React.useEffect(() => {
    let tempSubTotal = 0;
    products.forEach((product) => {
      tempSubTotal += product.price * (order.productCounts.get(product.id) as number);
    });
    setSubTotal(tempSubTotal);
  }, [products]);

  return (
    <React.Fragment>
      {products.map((product) => {
        const count = order.productCounts.get(product.id) as number;
        const price = formatter.format(product.price * count);
        return (
          <div key={`product-${product.id}`} className={classes.item}>
            <Badge color="secondary" badgeContent={count} style={{ marginRight: 20 }}>
              <img src={`images/demo/${product.id.toUpperCase()}.webp`} style={{ maxHeight: 40 }} />
            </Badge>
            <Typography className={classes.flexGrow}>{product.name}</Typography>
            <Typography style={{ margin: "auto" }}>{price}</Typography>
          </div>
        );
      })}
      <div className={classes.infoDisplay}>
        <div className={classes.infoSubDisplay}>
          <div className={classes.flex}>
            <Typography className={classes.flexGrow}>Subtotal</Typography>
            <Typography>{formatter.format(subTotal)}</Typography>
          </div>
        </div>
      </div>
      <Status processing={processing} error={error} />
      <div className={classes.infoSubDisplay}>
        <div className={classes.flex}>
          <Button
            size="large"
            variant="contained"
            style={{ marginLeft: "auto" }}
            onClick={() => window.location.replace("/checkout")}
          >
            Check out
          </Button>
        </div>
      </div>
    </React.Fragment>
  );
};
