<template>
  <div id="app">
    <Loader v-if="is_loading" />

    <nav class="navbar navbar-dark bg-primary">
      <div class="container">
        <a class="navbar-brand" href="#">Book Submissions Dashboard</a>
      </div>
    </nav>

    <modal name="more-info-modal"></modal>

    <div class="container">
      <table class="table table-hove table-striped table-responsive mt-4 mb-4">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Email</th>
            <th scope="col">Date Created</th>
            <th scope="col">Date Paid</th>
            <th scope="col">Order ID</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in submissions" :key="item.id">
            <td>
              <small>{{ item.id }}</small>
            </td>
            <td>
              <small>{{ item.email }}</small>
            </td>
            <td>
              <small>{{ item.date_created }}</small>
            </td>
            <td>
              <small>{{ item.date_paid }}</small>
            </td>
            <td>
              <small>{{ item.order_id }}</small>
            </td>
            <td>
              <button
                :disabled="!item.order_id"
                @click="
                  submit(
                    item.order_id,
                    item.inner_pdf_link,
                    item.outer_pdf_link,
                    item.customer_name,
                    item.town,
                    item.postcode,
                    item.iso_country,
                    item.shipping_alias,
                    item.sku,
                    item.unit_cost,
                    item.address_line
                  )
                "
                class="btn btn-primary btn-sm"
              >
                Print
              </button>
              <a
                target="_blank"
                :href="item.inner_pdf_link"
                class="btn btn-secondary btn-sm ms-2"
                >Inner PDF</a
              >
              <a
                target="_blank"
                :href="item.outer_pdf_link"
                class="btn btn-secondary btn-sm ms-2"
                >Outer PDF</a
              >

              <button
                @click="showMoreInfo(item)"
                class="btn btn-primary btn-sm ms-2"
                type="button"
              >
                More Info
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import MoreInfo from "./components/MoreInfo.vue";

import Loader from "./components/Loader.vue";

export default {
  data() {
    return {
      submissions: [],
      is_loading: true,
    };
  },
  methods: {
    // #region old submit
    /*
    submit(order_id, inner_pdf, outer_pdf) {
      let method = "POST";
      let path = "/api/order";
      let timestamp = Math.floor(Date.now() / 1000);
      let secret = "a3b2f495e1dc171a45d686747a9478d9cdbe1ed646d25791";
      let token = "1916514645615";

      let stringToSign = method + " " + path + " " + timestamp;
      let signature = crypto
        .HmacSHA1(stringToSign, secret)
        .toString(crypto.enc.Hex);
      let authHeader = token + ":" + signature;

      let data = {
        destination: {
          name: "pureprint",
        },
        orderData: {
          sourceOrderId: order_id,
          customerName: "hectorspost",
          items: [
            {
              barcode: order_id,
              shipmentIndex: 0,
              sourceItemId: order_id,
              sku: "hectorspost_staging",
              quantity: 1,
              unitCost: 0.0,
              components: [
                {
                  path: inner_pdf,
                  fetch: true,
                  localFile: false,
                  code: "text",
                },
                {
                  path: outer_pdf,
                  fetch: true,
                  localFile: false,
                  code: "cover",
                },
              ],
            },
          ],
          shipments: [
            {
              shipmentIndex: 0,
              shipTo: {
                name: "Test Tester ",
                companyName: "Test Company",
                address1: "Do Not Ship",
                town: "DO NOT SHIP",
                postcode: "1ES TE1",
                isoCountry: "GB",
              },
              shipByDate: "2021-09-09T13:15:25.7654838+01:00",
              canShipEarly: false,
              returnAddress: {
                name: "Test",
                companyName: "Pureprint Group",
                address1: "Beon House, Bellbrook Park",
                town: "Uckfield",
                postcode: "TN22 1PL",
                isoCountry: "GB",
              },
              carrier: {
                alias: "shippingtest",
              },
              dispatchAlert: "",
            },
          ],
          tags: ["0"],
        },
      };

      axios
        .post("https://pro-api.oneflowcloud.com/api/order", data, {
          headers: {
            "x-oneflow-authorization": authHeader,
            Accept: "application/json",
            "x-oneflow-date": timestamp,
          },
        })
        .then((res) => {
          if (res.status == 200 || res.status == 201) {
            alert("Book has been submitted to OneFlow");
          }
        })
        .catch((err) => {
          console.log(err);
          alert(
            "There was an error, or an order with the same id has already been submitted to OneFlow"
          );
        });
    
    },
    */
    // #endregion
    submit(
      order_id,
      inner_pdf,
      outer_pdf,
      customer_name,
      town,
      postcode,
      iso_country,
      shipping_alias,
      sku,
      unit_cost,
      address_line
    ) {
      this.is_loading = true;
      JSON.stringify(order_id, inner_pdf, outer_pdf);
      axios
        .post("https://oneflowrelay.hectorspost.com/submit_order", {
          order_id: order_id,
          inner_pdf: inner_pdf,
          outer_pdf: outer_pdf,
          customer_name: customer_name,
          town: town,
          postcode: postcode,
          iso_country: iso_country,
          shipping_alias: shipping_alias,
          sku: sku,
          unit_cost: unit_cost,
          address_line: address_line,
        })
        .then((res) => {
          console.log(res);
          if (res.data.status == "success") {
            this.is_loading = false;
            Toastify({
              text: "Success! Order submitted to oneflow.",
              className: "info",
              gravity: "bottom",
              position: "left",
              style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
                fontSize: "14px",
              },
            }).showToast();
          } else {
            this.is_loading = false;
            Toastify({
              text:
                "Error: An order with the same ID has already been submitted",
              className: "info",
              gravity: "bottom",
              position: "left",
              style: {
                background: "linear-gradient(45deg, #f85032,#e73827)",
                fontSize: "14px",
              },
            }).showToast();
          }
        })
        .catch((err) => {
          this.is_loading = false;
          console.log(err);
        });
    },
    showMoreInfo(item) {
      this.$modal.show(
        MoreInfo,
        {
          item: item,
        },
        {
          scrollable: true,
          height: "auto",
          styles: "padding:20px",
        }
      );
    },
  },
  components: {
    Loader,
  },
  created() {
    axios
      .get("https://bebraveapi.hectorspost.com/results.php")
      .then((res) => {
        this.submissions = res.data;
        console.log(res.data);
        this.is_loading = false;
      })
      .catch((err) => {
        console.log(err);
        this.is_loading = false;
      });
  },
};
</script>

<style>
.btn-sm {
  font-size: 11px;
}
</style>
