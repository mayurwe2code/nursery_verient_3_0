// SELECT `order`.`id`, `order`.`order_date`,`user`.`first_name`, `user`.`last_name` from `order` INNER JOIN `user` ON `order`.`user_id`= `user`.`id`
//CREATE VIEW cart_view AS SELECT cart.id as id, cart.product_id,cart.user_id,product.name,product.price,product.image FROM cart INNER JOIN product ON product.id =cart.product_id

// CREATE VIEW user_view AS SELECT user.id as User_id, user.first_name , user.last_name , user.email, user.password , user.phone_no, user.pincode, user.city, user.address , user.alternate_address, user.created_on ,cart.quantity, cart.id , cart.user_id as user_cart_id , cart.product_id FROM user INNER JOIN cart ON cart.user_id =user.id

// CREATE VIEW order_view AS SELECT order.id as Order_id, order.user_id , order.total_quantity ,order.total_amount, order.total_gst, order.total_cgst, order.total_sgst, order.shipping_charges, order.invoice_id, order.payment_mode, order.payment_ref_id, order.order_date ,order.delivery_date, order.invoice_date, order.discount_coupon, order.discount_coupon_value ,order.created_on , user.id as User_id FROM `order` INNER JOIN user ON order.user_id = user.id


// select *,(SELECT GROUP_CONCAT(product_image_path) FROM product_images WHERE product_images.product_id = cart_view_1.product_id) AS all_images_url, (SELECT GROUP_CONCAT(product_image_path) FROM product_images WHERE product_images.product_id = cart_view_1.product_id AND image_position = "cover" group by product_images.product_id) AS cover_image from cart_view_1 where user_id="19"

// commoun_table                                   verient_table

// id                                             brand
// vendor_id                                      quantity
// name                                           unit
// seo_tag
//                                                product_stock_quantity     
//                                                price       
//                                                mrp       
//                                                gst         
//                                                sgst       
//                                                cgst        
// category                                       height        
//                                                width        

// is_deleted                                     varient_is_deleted
// status                                         varient_status
// review
// discount
// rating
// description                                    varient_description
// is_active                                      verient_is_active
// created_by
// created_by_id
// created_on                                     verient_created_on
// updated_on                                     verient_updated_on


// CREATE VIEW product_view AS SELECT *, (SELECT GROUP_CONCAT(product_image_path) FROM product_images WHERE product_images.product_verient_id = product_verient.product_id AND image_position = 'cover' group by product_verient_id) as all_images, (SELECT GROUP_CONCAT(product_image_path) FROM product_images WHERE product_images.product_verient_id = product_verient.product_id group by product_verient_id) as cover_image FROM product, product_verient WHERE product.id = product_verient.product_id

