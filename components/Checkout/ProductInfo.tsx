import React from "react";

import { Badge, createStyles, Theme, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { ProductViewModel } from "../../types";

import { useAppContext } from "../../../AppContext";

interface Props {
  products: Array<ProductViewModel>;
  formatter: Intl.NumberFormat;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    flexGrow: {
      flexGrow: 1,
      margin: "auto",
    },
    checkoutItem: {
      display: "flex",
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
  })
);

export const ProductInfo: React.FC<Props> = ({ products, formatter }) => {
  const classes = useStyles();

  const { order } = useAppContext();

  return (
    <React.Fragment>
      {products.map((product) => {
        const count = order.productCounts.get(product.id) as number;
        const price = formatter.format(product.price * count);
        return (
          <div key={`product-${product.id}`} className={classes.checkoutItem}>
            <Badge color="secondary" badgeContent={count} style={{ marginRight: 20 }}>
              <img src={`images/demo/${product.id.toUpperCase()}.webp`} style={{ maxHeight: 40 }} />
            </Badge>
            <Typography className={classes.flexGrow}>{product.name}</Typography>
            <Typography style={{ margin: "auto" }}>{price}</Typography>
          </div>
        );
      })}
    </React.Fragment>
  );
};
