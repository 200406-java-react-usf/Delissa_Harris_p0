--drop table order_line;
--drop table products;
--drop table orders;
--drop table app_users;
--drop table user_roles;

create user order_api
with password 'revature';

create database orders;

grant all privileges 
on database orders
to order_api;

set search_path to order_api;

create table user_roles(
	id serial,
	name varchar(25) not null,
	constraint user_roles_pk primary key (id)
);
create table app_users(
	id serial,
	username varchar(25) unique not null, 
	password varchar(256) not null,
	first_name varchar(25) not null,
	last_name varchar(25) not null,
	email varchar(256) unique not null,
	role_id int not null,
	constraint app_users_pk primary key (id),
	constraint user_role_fk foreign key (role_id) references user_roles
);
create table orders(
	order_id serial,
	order_date timestamp with time zone default current_timestamp,
	order_comments varchar(2056),
	user_id int not null,
	constraint orders_pk primary key (order_id),
	constraint order_creator_fk foreign key (user_id) references app_users
);
create table products(
	product_id serial,
	product_name varchar(50) not null,
	description varchar(256) not null,
	product_cost numeric not null,
	created_time timestamp with time zone default current_timestamp,
	constraint products_pk primary key (product_id)
);

create table order_line(
	product_id int not null,
	order_id int not null,
	quantity int not null,
	constraint post_likers_pks primary key (product_id, order_id),
	constraint pl_product foreign key (product_id) references products,
	constraint pl_order foreign key (order_id) references orders
);

insert into user_roles (name) values ('Admin'), ('Dev'), ('Customer'), ('Locked');

insert into app_users (username, password, first_name, last_name, email, role_id) values
	('aanderson', 'password', 'Alice', 'Anderson', 'aanderson@revature.com', 1),
	('bbailey', 'password', 'Bob', 'Bailey', 'bbailey@revature.com', 2),
	('ccalhoun', 'password', 'Charles', 'Calhoun', 'ccalhoun@revature.com', 3),
	('ddavis', 'password', 'Daniel', 'Davis', 'ddavis@revature.com', 3),
	('eeinstein', 'password', 'Emily', 'Anderson', 'eeinstein@revature.com', 3);

insert into orders (order_comments, user_id) values 
	('Thank you', 1),
	('Darkest awaits', 2),
	(null, 3),
	('Lastest', 4),
	('No refunds or exchange', 5)

insert into products (product_name, description, product_cost) values 
	('Predator: Hunting Grounds - PlayStation 4', 
	'Predator: Hunting Grounds is an immersive asymmetrical multiplayer* shooter set in the remote jungles of the world, where the Predator stalks the most challenging prey.', 39.99),
	('Final Fantasy VII Remake - PlayStation 4', 
	'A spectacular reimagining of one of the most visionary games ever, FINAL FANTASY VII REMAKE rebuilds and expands the legendary RPG for today.', 59.99),
	('Call of Duty: Modern Warfare - PlayStation 4', 'Prepare to go dark, Modern Warfare is back.', 59.99),
	('The Last of Us Part II - PlayStation 4', 
	'When a violent event disrupts that peace, Ellie embarks on a relentless journey to carry out justice and find closure.', 59.99),
	('Fortnite Darkfire Bundle - PlayStation 4', 
	'This Fortnite: Darkfire Bundle includes three Legendary outfits and three Legendary back-wear to change your avatars looks.', 16.99);

insert into order_line (product_id, order_id, quantity) values 
(2, 1, 2),
(1, 4, 1),
(3, 5, 3),
(5, 3, 2),
(4, 2, 4);

commit;