--
-- PostgreSQL database dump
--

\restrict bM14EIhidDzUjhll59OubOJFN5P9ng3UY8LIpugewmO9W6qh0TIBk0qrOnPMvfe

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pg_trgm; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;


--
-- Name: EXTENSION pg_trgm; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: book_formats; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.book_formats (
    format character varying(50) NOT NULL,
    sku character varying(50) NOT NULL,
    price numeric(10,2) NOT NULL,
    list_price numeric(10,2),
    stock integer,
    page_count integer,
    is_digital boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    book_id uuid NOT NULL
);


ALTER TABLE public.book_formats OWNER TO postgres;

--
-- Name: books; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.books (
    title character varying(200) NOT NULL,
    subtitle character varying(200),
    description text NOT NULL,
    genre character varying(100),
    edition character varying(100),
    series character varying(100),
    publisher character varying(150),
    publication_date date,
    author_bio text,
    isbn10 character varying(20) NOT NULL,
    isbn13 character varying(20) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    authors text[] NOT NULL,
    tags text[],
    awards text[],
    images jsonb DEFAULT '{}'::jsonb,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE public.books OWNER TO postgres;

--
-- Name: cart_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    format_id uuid NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.cart_items OWNER TO postgres;

--
-- Name: order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    order_id uuid NOT NULL,
    book_id uuid NOT NULL,
    format_id uuid NOT NULL,
    price numeric(10,2) NOT NULL,
    quantity integer NOT NULL,
    CONSTRAINT order_items_quantity_check CHECK ((quantity > 0))
);


ALTER TABLE public.order_items OWNER TO postgres;

--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    total_amount numeric(10,2) NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    favorites jsonb,
    cart jsonb DEFAULT '[]'::jsonb,
    refresh_token text,
    address jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Data for Name: book_formats; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.book_formats (format, sku, price, list_price, stock, page_count, is_digital, created_at, updated_at, id, book_id) FROM stdin;
Paperback	BOOK1-PB	299.00	349.00	12	192	f	2025-12-17 18:10:10.639671	2025-12-17 18:10:10.639671	a6afd9d4-796b-425b-85ca-af96fb0d954c	8a949e86-4b60-4d02-8054-373673a04c28
Hardcover	BOOK1-HC	499.00	599.00	7	192	f	2025-12-17 18:10:10.639671	2025-12-17 18:10:10.639671	148a3e85-360a-483d-8a90-39890935ae74	8a949e86-4b60-4d02-8054-373673a04c28
Ebook	BOOK1-EB	199.00	249.00	999	192	t	2025-12-17 18:10:10.639671	2025-12-17 18:10:10.639671	7266de9e-98a0-414d-b315-db3b8371211a	8a949e86-4b60-4d02-8054-373673a04c28
Paperback	BOOK2-PB	299.00	349.00	12	216	f	2025-12-17 18:10:10.653351	2025-12-17 18:10:10.653351	1008609a-9146-4d0f-87b8-d613c0835507	66f707cc-d4ad-432f-911b-67b3d94134fb
Hardcover	BOOK2-HC	499.00	599.00	7	216	f	2025-12-17 18:10:10.653351	2025-12-17 18:10:10.653351	264f37d3-5e91-482e-a53b-4c37e107108f	66f707cc-d4ad-432f-911b-67b3d94134fb
Ebook	BOOK2-EB	199.00	249.00	999	216	t	2025-12-17 18:10:10.653351	2025-12-17 18:10:10.653351	188cd365-8579-4ddf-8099-68f65664fb70	66f707cc-d4ad-432f-911b-67b3d94134fb
Paperback	BOOK3-PB	299.00	349.00	12	192	f	2025-12-17 18:10:10.656767	2025-12-17 18:10:10.656767	6b25e163-c009-475b-906f-9eac14a0a6d7	1e8ba02e-a7ca-431d-b761-f53d699ebce9
Hardcover	BOOK3-HC	499.00	599.00	7	192	f	2025-12-17 18:10:10.656767	2025-12-17 18:10:10.656767	eb01dde1-2d8c-4a73-beda-ea1b87c66bdf	1e8ba02e-a7ca-431d-b761-f53d699ebce9
Ebook	BOOK3-EB	199.00	249.00	999	192	t	2025-12-17 18:10:10.656767	2025-12-17 18:10:10.656767	f97438a2-a490-4086-b42a-425f4742318c	1e8ba02e-a7ca-431d-b761-f53d699ebce9
Paperback	BOOK4-PB	299.00	349.00	12	192	f	2025-12-17 18:10:10.659409	2025-12-17 18:10:10.659409	c9a161dc-6a81-4b12-8f3e-e9f825624ccd	9258c6d4-46fc-4399-abde-ca2c4b8a5832
Hardcover	BOOK4-HC	499.00	599.00	7	192	f	2025-12-17 18:10:10.659409	2025-12-17 18:10:10.659409	a23cfb1b-9192-489b-b3b9-a4c2b7017bd4	9258c6d4-46fc-4399-abde-ca2c4b8a5832
Ebook	BOOK4-EB	199.00	249.00	999	192	t	2025-12-17 18:10:10.659409	2025-12-17 18:10:10.659409	2bc822f5-a296-483c-b4e7-be9b7abae9d1	9258c6d4-46fc-4399-abde-ca2c4b8a5832
Paperback	BOOK5-PB	299.00	349.00	12	193	f	2025-12-17 18:10:10.66182	2025-12-17 18:10:10.66182	a133e350-a711-4578-8207-f8df20670ec5	ff9c21fd-758e-4c26-b2d9-a893c766b6e1
Hardcover	BOOK5-HC	499.00	599.00	7	193	f	2025-12-17 18:10:10.66182	2025-12-17 18:10:10.66182	6b66c6e4-247b-4ff7-a97a-5c3b79ac89b5	ff9c21fd-758e-4c26-b2d9-a893c766b6e1
Ebook	BOOK5-EB	199.00	249.00	999	193	t	2025-12-17 18:10:10.66182	2025-12-17 18:10:10.66182	cc48ac90-ef2b-49a8-acb2-d9392fbcea59	ff9c21fd-758e-4c26-b2d9-a893c766b6e1
Paperback	BOOK6-PB	299.00	349.00	12	200	f	2025-12-17 18:10:10.664034	2025-12-17 18:10:10.664034	12399676-5e42-4f64-bce3-054659f62197	f862ce07-6c59-44d9-95a3-f52782ccf72b
Hardcover	BOOK6-HC	499.00	599.00	7	200	f	2025-12-17 18:10:10.664034	2025-12-17 18:10:10.664034	4ced5ab8-3e81-49b7-a623-e1f100173c8d	f862ce07-6c59-44d9-95a3-f52782ccf72b
Ebook	BOOK6-EB	199.00	249.00	999	200	t	2025-12-17 18:10:10.664034	2025-12-17 18:10:10.664034	05608b0a-808d-4f52-ac1c-66c722a713f8	f862ce07-6c59-44d9-95a3-f52782ccf72b
Paperback	BOOK7-PB	299.00	349.00	12	192	f	2025-12-17 18:10:10.66599	2025-12-17 18:10:10.66599	32cb2890-e7f0-4c2a-859d-3eeb0764416d	c52f40dc-49f8-4cf1-9404-b4a322a487ad
Hardcover	BOOK7-HC	499.00	599.00	7	192	f	2025-12-17 18:10:10.66599	2025-12-17 18:10:10.66599	a97d7c51-ae58-4f49-a107-45a78fdfc7b9	c52f40dc-49f8-4cf1-9404-b4a322a487ad
Ebook	BOOK7-EB	199.00	249.00	999	192	t	2025-12-17 18:10:10.66599	2025-12-17 18:10:10.66599	d50db2af-b4cb-4fc6-90c5-47dc3f1d654f	c52f40dc-49f8-4cf1-9404-b4a322a487ad
Paperback	BOOK8-PB	299.00	349.00	12	224	f	2025-12-17 18:10:10.667843	2025-12-17 18:10:10.667843	fb18f063-e7ac-4167-aca3-55bddfdd685e	46a283d2-7c2c-4a02-8da6-d36998489210
Hardcover	BOOK8-HC	499.00	599.00	7	224	f	2025-12-17 18:10:10.667843	2025-12-17 18:10:10.667843	2457eba3-7e0a-4a1a-991f-f2900730fdbe	46a283d2-7c2c-4a02-8da6-d36998489210
Ebook	BOOK8-EB	199.00	249.00	999	224	t	2025-12-17 18:10:10.667843	2025-12-17 18:10:10.667843	1e7d4760-7658-4ae8-813b-9313b2a547e2	46a283d2-7c2c-4a02-8da6-d36998489210
Paperback	BOOK9-PB	299.00	349.00	12	208	f	2025-12-17 18:10:10.669609	2025-12-17 18:10:10.669609	b9c5badd-b16a-4372-b860-4330b64c123c	2b21b08b-f053-4749-a7ea-345b977353b2
Hardcover	BOOK9-HC	499.00	599.00	7	208	f	2025-12-17 18:10:10.669609	2025-12-17 18:10:10.669609	4c03cbfc-97ba-48c4-9835-d4888e1b9b92	2b21b08b-f053-4749-a7ea-345b977353b2
Ebook	BOOK9-EB	199.00	249.00	999	208	t	2025-12-17 18:10:10.669609	2025-12-17 18:10:10.669609	a1e87638-4f1e-435b-a8d3-49f0bbdf511e	2b21b08b-f053-4749-a7ea-345b977353b2
Paperback	BOOK10-PB	299.00	349.00	12	192	f	2025-12-17 18:10:10.671274	2025-12-17 18:10:10.671274	e3b8dce3-1350-49c0-9a7d-c6f08ae566e2	930ee418-f693-4144-b7f8-ed4ed63c5aed
Hardcover	BOOK10-HC	499.00	599.00	7	192	f	2025-12-17 18:10:10.671274	2025-12-17 18:10:10.671274	37e25e4a-190c-4830-aa11-f19dc901ea62	930ee418-f693-4144-b7f8-ed4ed63c5aed
Ebook	BOOK10-EB	199.00	249.00	999	192	t	2025-12-17 18:10:10.671274	2025-12-17 18:10:10.671274	7d781208-20e8-4843-bed2-3e9d60d65e05	930ee418-f693-4144-b7f8-ed4ed63c5aed
Paperback	BOOK11-PB	299.00	349.00	12	332	f	2025-12-17 18:10:10.672667	2025-12-17 18:10:10.672667	65101e9a-d0cd-46de-9c37-475967dd2615	0cb1caf5-abbe-4230-b4af-8516dd3b0731
Hardcover	BOOK11-HC	499.00	599.00	7	332	f	2025-12-17 18:10:10.672667	2025-12-17 18:10:10.672667	cc5f899e-ecd7-49f1-a4cd-09073136b95c	0cb1caf5-abbe-4230-b4af-8516dd3b0731
Ebook	BOOK11-EB	199.00	249.00	999	332	t	2025-12-17 18:10:10.672667	2025-12-17 18:10:10.672667	e6501058-88fa-4782-a94d-2234b6560776	0cb1caf5-abbe-4230-b4af-8516dd3b0731
Paperback	BOOK12-PB	299.00	349.00	12	310	f	2025-12-17 18:10:10.674128	2025-12-17 18:10:10.674128	f16baf4c-f750-4e4b-9e93-fc2b5b5df4fd	76408d56-c536-4ce1-852b-651053aabc84
Hardcover	BOOK12-HC	499.00	599.00	7	310	f	2025-12-17 18:10:10.674128	2025-12-17 18:10:10.674128	2cfa385d-e072-425a-a7e5-84503514c83c	76408d56-c536-4ce1-852b-651053aabc84
Ebook	BOOK12-EB	199.00	249.00	999	310	t	2025-12-17 18:10:10.674128	2025-12-17 18:10:10.674128	28d40a52-ff27-481d-97d8-26bd0b8d40bc	76408d56-c536-4ce1-852b-651053aabc84
Paperback	BOOK13-PB	299.00	349.00	12	208	f	2025-12-17 18:10:10.676946	2025-12-17 18:10:10.676946	a51c0b9d-ba82-47df-a5c6-8270c0606896	9a0b7e4c-09f8-4399-abc7-9fae8ed4deb4
Hardcover	BOOK13-HC	499.00	599.00	7	208	f	2025-12-17 18:10:10.676946	2025-12-17 18:10:10.676946	238d6844-e997-41f7-9dfe-b20662b04382	9a0b7e4c-09f8-4399-abc7-9fae8ed4deb4
Ebook	BOOK13-EB	199.00	249.00	999	208	t	2025-12-17 18:10:10.676946	2025-12-17 18:10:10.676946	1e3ea362-5824-438d-a059-0a2f956ec86c	9a0b7e4c-09f8-4399-abc7-9fae8ed4deb4
Paperback	BOOK14-PB	299.00	349.00	12	384	f	2025-12-17 18:10:10.681687	2025-12-17 18:10:10.681687	ef988bb3-f530-473e-9462-985cd004315d	5c361244-b3fa-4f71-9100-26b1adef393a
Hardcover	BOOK14-HC	499.00	599.00	7	384	f	2025-12-17 18:10:10.681687	2025-12-17 18:10:10.681687	987f5b9d-ddb5-4c52-852a-5143fa97458e	5c361244-b3fa-4f71-9100-26b1adef393a
Ebook	BOOK14-EB	199.00	249.00	999	384	t	2025-12-17 18:10:10.681687	2025-12-17 18:10:10.681687	f17d3e59-6ee7-41d5-85f3-04d3d4c2d300	5c361244-b3fa-4f71-9100-26b1adef393a
Paperback	BOOK15-PB	299.00	349.00	12	313	f	2025-12-17 18:10:10.683285	2025-12-17 18:10:10.683285	e60176e0-ce5e-40c5-917b-61357470c4ee	ad8419f3-ee34-4028-9e2d-fa7d94a68c29
Hardcover	BOOK15-HC	499.00	599.00	7	313	f	2025-12-17 18:10:10.683285	2025-12-17 18:10:10.683285	5f73cea8-29eb-44f1-aec9-70a9ed6adc6a	ad8419f3-ee34-4028-9e2d-fa7d94a68c29
Ebook	BOOK15-EB	199.00	249.00	999	313	t	2025-12-17 18:10:10.683285	2025-12-17 18:10:10.683285	79edf13b-c021-438d-8866-5d8b8e190dc6	ad8419f3-ee34-4028-9e2d-fa7d94a68c29
Paperback	BOOK16-PB	299.00	349.00	12	400	f	2025-12-17 18:10:10.685109	2025-12-17 18:10:10.685109	785742ef-12fa-4594-9c09-eb0b7644dc4d	bfb624aa-c470-4676-9d20-16f55db52e35
Hardcover	BOOK16-HC	499.00	599.00	7	400	f	2025-12-17 18:10:10.685109	2025-12-17 18:10:10.685109	8c835c9c-1669-4df4-8472-52d83689c972	bfb624aa-c470-4676-9d20-16f55db52e35
Ebook	BOOK16-EB	199.00	249.00	999	400	t	2025-12-17 18:10:10.685109	2025-12-17 18:10:10.685109	98b2518d-f35c-4440-9235-9ecefb78dbbd	bfb624aa-c470-4676-9d20-16f55db52e35
Paperback	BOOK17-PB	299.00	349.00	12	432	f	2025-12-17 18:10:10.686558	2025-12-17 18:10:10.686558	1106358a-5a7b-464e-a629-acda1e8dbfd0	38104952-787e-44f7-bf19-db04ced2fd3e
Hardcover	BOOK17-HC	499.00	599.00	7	432	f	2025-12-17 18:10:10.686558	2025-12-17 18:10:10.686558	98267ebb-1011-40b3-88e8-cc2e27a9b37c	38104952-787e-44f7-bf19-db04ced2fd3e
Ebook	BOOK17-EB	199.00	249.00	999	432	t	2025-12-17 18:10:10.686558	2025-12-17 18:10:10.686558	72f771fb-018c-4ae7-bcb2-8413431c1c38	38104952-787e-44f7-bf19-db04ced2fd3e
Paperback	BOOK18-PB	299.00	349.00	12	188	f	2025-12-17 18:10:10.687828	2025-12-17 18:10:10.687828	9b2ed9d5-9bbb-478e-9574-e2b37196aa25	2e0530b8-10b6-42be-b030-5a20d947374c
Hardcover	BOOK18-HC	499.00	599.00	7	188	f	2025-12-17 18:10:10.687828	2025-12-17 18:10:10.687828	27eca617-cb15-4553-a3cd-ebcd796025e4	2e0530b8-10b6-42be-b030-5a20d947374c
Ebook	BOOK18-EB	199.00	249.00	999	188	t	2025-12-17 18:10:10.687828	2025-12-17 18:10:10.687828	4359be37-9196-4bc0-a8d5-8bf4d45e549b	2e0530b8-10b6-42be-b030-5a20d947374c
Paperback	BOOK19-PB	299.00	349.00	12	328	f	2025-12-17 18:10:10.689258	2025-12-17 18:10:10.689258	6f80b204-a16e-417c-a34e-01cb964a5305	02a3aef6-0e3c-4815-b361-323a558e2931
Hardcover	BOOK19-HC	499.00	599.00	7	328	f	2025-12-17 18:10:10.689258	2025-12-17 18:10:10.689258	94f9cc35-26be-4f4c-a172-e9ff4281bf00	02a3aef6-0e3c-4815-b361-323a558e2931
Ebook	BOOK19-EB	199.00	249.00	999	328	t	2025-12-17 18:10:10.689258	2025-12-17 18:10:10.689258	6e622d21-1861-4a89-a111-3d86afaf4c6d	02a3aef6-0e3c-4815-b361-323a558e2931
Paperback	BOOK20-PB	299.00	349.00	12	336	f	2025-12-17 18:10:10.690875	2025-12-17 18:10:10.690875	d897186f-fec2-4789-96d3-560098506c39	2f63bc7e-2b8a-499a-9518-8bd4a65bce37
Hardcover	BOOK20-HC	499.00	599.00	7	336	f	2025-12-17 18:10:10.690875	2025-12-17 18:10:10.690875	845066ca-8243-4a5e-824b-feac99d36213	2f63bc7e-2b8a-499a-9518-8bd4a65bce37
Ebook	BOOK20-EB	199.00	249.00	999	336	t	2025-12-17 18:10:10.690875	2025-12-17 18:10:10.690875	95b069c1-fc04-47a2-9970-ce0b5ffeadcb	2f63bc7e-2b8a-499a-9518-8bd4a65bce37
Paperback	BOOK21-PB	299.00	349.00	12	464	f	2025-12-17 18:10:10.692396	2025-12-17 18:10:10.692396	007bede5-f2a3-46cb-83de-369554429d4d	64a1787d-721a-4290-86c3-809508d81700
Hardcover	BOOK21-HC	499.00	599.00	7	464	f	2025-12-17 18:10:10.692396	2025-12-17 18:10:10.692396	8c190720-ae58-4a88-a42a-f7d03433c821	64a1787d-721a-4290-86c3-809508d81700
Ebook	BOOK21-EB	199.00	249.00	999	464	t	2025-12-17 18:10:10.692396	2025-12-17 18:10:10.692396	158dc0c9-21df-406c-98c8-f0a47ff4f02e	64a1787d-721a-4290-86c3-809508d81700
Paperback	BOOK22-PB	299.00	349.00	12	98	f	2025-12-17 18:10:10.694222	2025-12-17 18:10:10.694222	19198b86-2b8a-4139-8f61-47e5c431ba31	fb24ea39-490e-4f12-97b5-aa4ce0632e5e
Hardcover	BOOK22-HC	499.00	599.00	7	98	f	2025-12-17 18:10:10.694222	2025-12-17 18:10:10.694222	8268852b-d5f6-4d82-9c58-79644a10eb48	fb24ea39-490e-4f12-97b5-aa4ce0632e5e
Ebook	BOOK22-EB	199.00	249.00	999	98	t	2025-12-17 18:10:10.694222	2025-12-17 18:10:10.694222	82663f32-ecbd-4f31-a092-52e8290a57bc	fb24ea39-490e-4f12-97b5-aa4ce0632e5e
Paperback	BOOK23-PB	299.00	349.00	12	472	f	2025-12-17 18:10:10.696624	2025-12-17 18:10:10.696624	8aa4b589-9650-42eb-8487-31f68a5c3c69	6653eb77-884e-4d9d-96de-9e498e339788
Hardcover	BOOK23-HC	499.00	599.00	7	472	f	2025-12-17 18:10:10.696624	2025-12-17 18:10:10.696624	a8b25619-979d-4aff-a2c2-222529147488	6653eb77-884e-4d9d-96de-9e498e339788
Ebook	BOOK23-EB	199.00	249.00	999	472	t	2025-12-17 18:10:10.696624	2025-12-17 18:10:10.696624	9f133bf2-3210-4082-b926-8c0948050edd	6653eb77-884e-4d9d-96de-9e498e339788
Paperback	BOOK24-PB	299.00	349.00	12	616	f	2025-12-17 18:10:10.697841	2025-12-17 18:10:10.697841	8c6070ec-7679-4f10-8256-100534f2e568	b7793fbe-88b2-4735-ad0e-2ac87c1af64c
Hardcover	BOOK24-HC	499.00	599.00	7	616	f	2025-12-17 18:10:10.697841	2025-12-17 18:10:10.697841	7847f12b-c169-4cdd-9acc-bd0b3aff2def	b7793fbe-88b2-4735-ad0e-2ac87c1af64c
Ebook	BOOK24-EB	199.00	249.00	999	616	t	2025-12-17 18:10:10.697841	2025-12-17 18:10:10.697841	55462f76-f50f-4a9e-a551-6ce21210f54c	b7793fbe-88b2-4735-ad0e-2ac87c1af64c
Paperback	BOOK25-PB	299.00	349.00	12	1312	f	2025-12-17 18:10:10.699646	2025-12-17 18:10:10.699646	70b3176c-b702-4a5d-a4e2-7629511775e5	e98e2d83-240c-4233-bcdb-2fc68028787e
Hardcover	BOOK25-HC	499.00	599.00	7	1312	f	2025-12-17 18:10:10.699646	2025-12-17 18:10:10.699646	2cf9472b-096b-4633-b0a5-28e878058659	e98e2d83-240c-4233-bcdb-2fc68028787e
Ebook	BOOK25-EB	199.00	249.00	999	1312	t	2025-12-17 18:10:10.699646	2025-12-17 18:10:10.699646	4559bd51-0552-45c2-a9de-3984003e3d89	e98e2d83-240c-4233-bcdb-2fc68028787e
Paperback	BOOK26-PB	299.00	349.00	12	352	f	2025-12-17 18:10:10.700911	2025-12-17 18:10:10.700911	510ad3ee-807d-4423-b638-efc8bb39c639	a4714ac1-e835-49b8-97ec-3cdc9119a971
Hardcover	BOOK26-HC	499.00	599.00	7	352	f	2025-12-17 18:10:10.700911	2025-12-17 18:10:10.700911	500d90f8-b925-48e3-91f9-97c370704537	a4714ac1-e835-49b8-97ec-3cdc9119a971
Ebook	BOOK26-EB	199.00	249.00	999	352	t	2025-12-17 18:10:10.700911	2025-12-17 18:10:10.700911	67702cea-350c-43a8-bc75-72aa6e49cbdc	a4714ac1-e835-49b8-97ec-3cdc9119a971
Paperback	BOOK27-PB	299.00	349.00	12	706	f	2025-12-17 18:10:10.70234	2025-12-17 18:10:10.70234	5032867f-0d4c-4a09-ae2c-86e06665c620	01b46b5e-352e-45d8-99b1-1250c58d20f5
Hardcover	BOOK27-HC	499.00	599.00	7	706	f	2025-12-17 18:10:10.70234	2025-12-17 18:10:10.70234	342015f1-4402-48b0-94a1-49a262be1cea	01b46b5e-352e-45d8-99b1-1250c58d20f5
Ebook	BOOK27-EB	199.00	249.00	999	706	t	2025-12-17 18:10:10.70234	2025-12-17 18:10:10.70234	a406ce85-4c85-416f-a2ca-b5cf6a5d3654	01b46b5e-352e-45d8-99b1-1250c58d20f5
Paperback	BOOK28-PB	299.00	349.00	12	448	f	2025-12-17 18:10:10.704621	2025-12-17 18:10:10.704621	6b71701c-50d7-4f52-975b-f7eee00fbc17	5d1fbda4-cac6-4e21-b82b-faf587375acc
Hardcover	BOOK28-HC	499.00	599.00	7	448	f	2025-12-17 18:10:10.704621	2025-12-17 18:10:10.704621	c44d313e-7c0e-44fa-833c-7d0cc1901a07	5d1fbda4-cac6-4e21-b82b-faf587375acc
Ebook	BOOK28-EB	199.00	249.00	999	448	t	2025-12-17 18:10:10.704621	2025-12-17 18:10:10.704621	dab32bdf-3d77-40bd-a379-6e73c0854f57	5d1fbda4-cac6-4e21-b82b-faf587375acc
Paperback	BOOK29-PB	299.00	349.00	12	694	f	2025-12-17 18:10:10.70617	2025-12-17 18:10:10.70617	e22cb821-cac0-4a1b-a833-ddd64e354124	189fbf2d-08dd-4c0d-bd5a-f0181065c471
Hardcover	BOOK29-HC	499.00	599.00	7	694	f	2025-12-17 18:10:10.70617	2025-12-17 18:10:10.70617	6610d3eb-d8ad-4256-8960-406fd66bb025	189fbf2d-08dd-4c0d-bd5a-f0181065c471
Ebook	BOOK29-EB	199.00	249.00	999	694	t	2025-12-17 18:10:10.70617	2025-12-17 18:10:10.70617	a287314f-001d-4310-8938-0c4f49a5d109	189fbf2d-08dd-4c0d-bd5a-f0181065c471
Paperback	BOOK30-PB	299.00	349.00	12	544	f	2025-12-17 18:10:10.70767	2025-12-17 18:10:10.70767	91a58c1e-3868-4c87-a434-7ba830772900	3cb9abf8-b14a-4f6c-a672-54d705812f7d
Hardcover	BOOK30-HC	499.00	599.00	7	544	f	2025-12-17 18:10:10.70767	2025-12-17 18:10:10.70767	f21cb354-a4b7-4493-9b51-282857e45676	3cb9abf8-b14a-4f6c-a672-54d705812f7d
Ebook	BOOK30-EB	199.00	249.00	999	544	t	2025-12-17 18:10:10.70767	2025-12-17 18:10:10.70767	0b657aa8-67f3-41df-bff1-030ef4f3cb49	3cb9abf8-b14a-4f6c-a672-54d705812f7d
Paperback	BOOK31-PB	299.00	349.00	12	320	f	2025-12-17 18:10:10.709023	2025-12-17 18:10:10.709023	655c44f3-29e7-4bec-9571-060cf2006cb7	803c8edd-c28c-4fcb-ae2f-df021c10fd3c
Hardcover	BOOK31-HC	499.00	599.00	7	320	f	2025-12-17 18:10:10.709023	2025-12-17 18:10:10.709023	0a45557e-7c91-49ce-b1b9-ee81b1b75f69	803c8edd-c28c-4fcb-ae2f-df021c10fd3c
Ebook	BOOK31-EB	199.00	249.00	999	320	t	2025-12-17 18:10:10.709023	2025-12-17 18:10:10.709023	9a7964de-ec27-4d87-b6d5-fbf28b53335a	803c8edd-c28c-4fcb-ae2f-df021c10fd3c
Paperback	BOOK32-PB	299.00	349.00	12	336	f	2025-12-17 18:10:10.710431	2025-12-17 18:10:10.710431	15ca2514-bbec-4856-98b3-b5e0621ebce9	1381a381-2938-49e2-b521-ffdaf7ae445a
Hardcover	BOOK32-HC	499.00	599.00	7	336	f	2025-12-17 18:10:10.710431	2025-12-17 18:10:10.710431	16d9e48b-f5b9-4708-9544-279cf57326ee	1381a381-2938-49e2-b521-ffdaf7ae445a
Ebook	BOOK32-EB	199.00	249.00	999	336	t	2025-12-17 18:10:10.710431	2025-12-17 18:10:10.710431	5767ba05-c3f2-4f72-b384-7775dfe3e236	1381a381-2938-49e2-b521-ffdaf7ae445a
Paperback	BOOK33-PB	299.00	349.00	12	252	f	2025-12-17 18:10:10.711993	2025-12-17 18:10:10.711993	c980fcb7-fc9f-4b67-8c02-e22bab3620bc	efe48fda-e938-4c48-9a57-5bc7257de23e
Hardcover	BOOK33-HC	499.00	599.00	7	252	f	2025-12-17 18:10:10.711993	2025-12-17 18:10:10.711993	20c733c7-3377-4069-a463-1ef7a6464d13	efe48fda-e938-4c48-9a57-5bc7257de23e
Ebook	BOOK33-EB	199.00	249.00	999	252	t	2025-12-17 18:10:10.711993	2025-12-17 18:10:10.711993	156864fe-0287-4c84-a3a7-442e55e5c224	efe48fda-e938-4c48-9a57-5bc7257de23e
Paperback	BOOK34-PB	299.00	349.00	12	320	f	2025-12-17 18:10:10.713626	2025-12-17 18:10:10.713626	7f0bfd90-57e1-4331-ae78-b3a6f3d9a4ac	ebbdee85-a89c-47a9-bccd-9bab46db8752
Hardcover	BOOK34-HC	499.00	599.00	7	320	f	2025-12-17 18:10:10.713626	2025-12-17 18:10:10.713626	7656becd-b7cb-4ea0-87de-088a803cb9d9	ebbdee85-a89c-47a9-bccd-9bab46db8752
Ebook	BOOK34-EB	199.00	249.00	999	320	t	2025-12-17 18:10:10.713626	2025-12-17 18:10:10.713626	897180ce-ed90-429d-b184-f8ccd07c58c9	ebbdee85-a89c-47a9-bccd-9bab46db8752
Paperback	BOOK35-PB	299.00	349.00	12	296	f	2025-12-17 18:10:10.715082	2025-12-17 18:10:10.715082	1155a78d-3727-46cf-89b8-1d19010aee18	34262cbc-ce23-462b-ad26-3cd0178daad1
Hardcover	BOOK35-HC	499.00	599.00	7	296	f	2025-12-17 18:10:10.715082	2025-12-17 18:10:10.715082	c6fc4d97-7f25-4ea8-a8fb-201ba87c8bcf	34262cbc-ce23-462b-ad26-3cd0178daad1
Ebook	BOOK35-EB	199.00	249.00	999	296	t	2025-12-17 18:10:10.715082	2025-12-17 18:10:10.715082	f9a095be-ae9d-416f-9ea4-83624b330b9b	34262cbc-ce23-462b-ad26-3cd0178daad1
Paperback	BOOK36-PB	299.00	349.00	12	224	f	2025-12-17 18:10:10.716348	2025-12-17 18:10:10.716348	665a70f7-1650-4faf-91d9-491680cb845d	66c22bf9-3276-4c58-911d-92791c763d1d
Hardcover	BOOK36-HC	499.00	599.00	7	224	f	2025-12-17 18:10:10.716348	2025-12-17 18:10:10.716348	9c54fead-bba4-4878-aff1-72376edc27f6	66c22bf9-3276-4c58-911d-92791c763d1d
Ebook	BOOK36-EB	199.00	249.00	999	224	t	2025-12-17 18:10:10.716348	2025-12-17 18:10:10.716348	1fdd83a3-52cc-4315-b28c-f6cfb9957e9e	66c22bf9-3276-4c58-911d-92791c763d1d
Paperback	BOOK37-PB	299.00	349.00	12	498	f	2025-12-17 18:10:10.717893	2025-12-17 18:10:10.717893	64d66616-f304-4be6-8f68-e3d3084cadc0	506ac6ff-7859-46e9-9462-6596f6ba0ea6
Hardcover	BOOK37-HC	499.00	599.00	7	498	f	2025-12-17 18:10:10.717893	2025-12-17 18:10:10.717893	bde922a0-1cec-41cc-b606-a060906fdd19	506ac6ff-7859-46e9-9462-6596f6ba0ea6
Ebook	BOOK37-EB	199.00	249.00	999	498	t	2025-12-17 18:10:10.717893	2025-12-17 18:10:10.717893	43fa425d-de42-435b-9204-795ebf127fd7	506ac6ff-7859-46e9-9462-6596f6ba0ea6
Paperback	BOOK38-PB	299.00	349.00	12	208	f	2025-12-17 18:10:10.719298	2025-12-17 18:10:10.719298	8c15c804-8960-49d3-83cb-922376c4b3d8	630fc197-b688-4e4a-8637-13f332c1c121
Hardcover	BOOK38-HC	499.00	599.00	7	208	f	2025-12-17 18:10:10.719298	2025-12-17 18:10:10.719298	86fa30ba-f220-412a-8243-c81ceca91afd	630fc197-b688-4e4a-8637-13f332c1c121
Ebook	BOOK38-EB	199.00	249.00	999	208	t	2025-12-17 18:10:10.719298	2025-12-17 18:10:10.719298	8f00c901-7b13-4fe9-a6d2-3ffc631c2ae0	630fc197-b688-4e4a-8637-13f332c1c121
Paperback	BOOK39-PB	299.00	349.00	12	200	f	2025-12-17 18:10:10.720726	2025-12-17 18:10:10.720726	09922487-dec3-47ef-8cc3-6b5979d18eef	c271bcae-0350-4d46-9807-701dc61364af
Hardcover	BOOK39-HC	499.00	599.00	7	200	f	2025-12-17 18:10:10.720726	2025-12-17 18:10:10.720726	f433701b-a0a6-43f2-a187-4c117a362e88	c271bcae-0350-4d46-9807-701dc61364af
Ebook	BOOK39-EB	199.00	249.00	999	200	t	2025-12-17 18:10:10.720726	2025-12-17 18:10:10.720726	920f38e2-f7ea-4e0f-8920-f03a6e014272	c271bcae-0350-4d46-9807-701dc61364af
Paperback	BOOK40-PB	299.00	349.00	12	371	f	2025-12-17 18:10:10.72331	2025-12-17 18:10:10.72331	759fe447-1422-4f79-864e-385573e35ec8	0d55a4a4-dbf8-4832-8fe0-975fed5de3a0
Hardcover	BOOK40-HC	499.00	599.00	7	371	f	2025-12-17 18:10:10.72331	2025-12-17 18:10:10.72331	985ab036-4b7f-4e59-8331-bb7557fb86e9	0d55a4a4-dbf8-4832-8fe0-975fed5de3a0
Ebook	BOOK40-EB	199.00	249.00	999	371	t	2025-12-17 18:10:10.72331	2025-12-17 18:10:10.72331	6d334501-eba2-4714-a256-b8dc2a5015c4	0d55a4a4-dbf8-4832-8fe0-975fed5de3a0
Paperback	BOOK41-PB	299.00	349.00	12	144	f	2025-12-17 18:10:10.724625	2025-12-17 18:10:10.724625	9401ce39-c300-4fac-98d0-026ac1250c87	c5c2ea3a-57a2-4e0a-b736-58e01dda0ac8
Hardcover	BOOK41-HC	499.00	599.00	7	144	f	2025-12-17 18:10:10.724625	2025-12-17 18:10:10.724625	55aea2fc-6036-4559-b736-ed735093c9f2	c5c2ea3a-57a2-4e0a-b736-58e01dda0ac8
Ebook	BOOK41-EB	199.00	249.00	999	144	t	2025-12-17 18:10:10.724625	2025-12-17 18:10:10.724625	3569daf4-5c86-4830-8357-c68271df9e0c	c5c2ea3a-57a2-4e0a-b736-58e01dda0ac8
Paperback	BOOK42-PB	299.00	349.00	12	416	f	2025-12-17 18:10:10.727078	2025-12-17 18:10:10.727078	b7d88164-ddae-4ef8-8728-ebb61ba212a4	31c29ee4-18ec-4fd3-bf22-419edec62530
Hardcover	BOOK42-HC	499.00	599.00	7	416	f	2025-12-17 18:10:10.727078	2025-12-17 18:10:10.727078	67470107-f171-4b74-b240-77dd6c504946	31c29ee4-18ec-4fd3-bf22-419edec62530
Ebook	BOOK42-EB	199.00	249.00	999	416	t	2025-12-17 18:10:10.727078	2025-12-17 18:10:10.727078	cf3bf037-1803-4458-863b-2560624af381	31c29ee4-18ec-4fd3-bf22-419edec62530
Paperback	BOOK43-PB	299.00	349.00	12	144	f	2025-12-17 18:10:10.728849	2025-12-17 18:10:10.728849	0ffbd6cd-2b0c-4f17-beac-73d3590ac784	34786406-2a02-4336-a7f1-35c42c133a3c
Hardcover	BOOK43-HC	499.00	599.00	7	144	f	2025-12-17 18:10:10.728849	2025-12-17 18:10:10.728849	a211b27b-9297-4aed-a754-afbc9d1d5c1e	34786406-2a02-4336-a7f1-35c42c133a3c
Ebook	BOOK43-EB	199.00	249.00	999	144	t	2025-12-17 18:10:10.728849	2025-12-17 18:10:10.728849	e64a96a8-d73e-4268-a43a-ee1a23ff5014	34786406-2a02-4336-a7f1-35c42c133a3c
Paperback	BOOK44-PB	299.00	349.00	12	144	f	2025-12-17 18:10:10.731007	2025-12-17 18:10:10.731007	61dd8a47-439b-4efb-943a-e86ab179f8e0	e8afea21-46cb-4c32-b494-af3ce83028ff
Hardcover	BOOK44-HC	499.00	599.00	7	144	f	2025-12-17 18:10:10.731007	2025-12-17 18:10:10.731007	b5cb65f6-b10d-42e9-850e-394bb61e542a	e8afea21-46cb-4c32-b494-af3ce83028ff
Ebook	BOOK44-EB	199.00	249.00	999	144	t	2025-12-17 18:10:10.731007	2025-12-17 18:10:10.731007	b940b0ce-f610-40dd-80eb-fc84b1d1d8a8	e8afea21-46cb-4c32-b494-af3ce83028ff
Paperback	BOOK45-PB	299.00	349.00	12	200	f	2025-12-17 18:10:10.732652	2025-12-17 18:10:10.732652	c49ee9e6-be74-40ab-8e20-7ada49f20b67	93e24524-4dfc-4bde-ae68-a79881b77a4f
Hardcover	BOOK45-HC	499.00	599.00	7	200	f	2025-12-17 18:10:10.732652	2025-12-17 18:10:10.732652	533edaeb-e1b2-4847-a580-7e0e30c321bf	93e24524-4dfc-4bde-ae68-a79881b77a4f
Ebook	BOOK45-EB	199.00	249.00	999	200	t	2025-12-17 18:10:10.732652	2025-12-17 18:10:10.732652	06dea0f5-58f6-4b23-afef-6ada0257b95b	93e24524-4dfc-4bde-ae68-a79881b77a4f
Paperback	BOOK46-PB	299.00	349.00	12	296	f	2025-12-17 18:10:10.734354	2025-12-17 18:10:10.734354	57109642-d8de-484e-b600-311ff184ada1	1ef1aec4-6403-4558-a46b-237f7feea57d
Hardcover	BOOK46-HC	499.00	599.00	7	296	f	2025-12-17 18:10:10.734354	2025-12-17 18:10:10.734354	54393332-0805-4183-940b-d81d06b388d2	1ef1aec4-6403-4558-a46b-237f7feea57d
Ebook	BOOK46-EB	199.00	249.00	999	296	t	2025-12-17 18:10:10.734354	2025-12-17 18:10:10.734354	6b30428d-0f99-42db-9bc3-f206d87a5b4a	1ef1aec4-6403-4558-a46b-237f7feea57d
Paperback	BOOK47-PB	299.00	349.00	12	160	f	2025-12-17 18:10:10.736087	2025-12-17 18:10:10.736087	636910a3-25fb-441d-aeb6-026ea3b5a8b2	d7e4085d-0949-4ecb-b8a1-d85d618c7efa
Hardcover	BOOK47-HC	499.00	599.00	7	160	f	2025-12-17 18:10:10.736087	2025-12-17 18:10:10.736087	59032382-e4d0-464b-b7b3-0f1235d0f39a	d7e4085d-0949-4ecb-b8a1-d85d618c7efa
Ebook	BOOK47-EB	199.00	249.00	999	160	t	2025-12-17 18:10:10.736087	2025-12-17 18:10:10.736087	7251122e-2a03-49ae-a884-ed784cd53c97	d7e4085d-0949-4ecb-b8a1-d85d618c7efa
Paperback	BOOK48-PB	299.00	349.00	12	208	f	2025-12-17 18:10:10.737844	2025-12-17 18:10:10.737844	44086ebf-b99c-4754-9b47-12434ee55bc5	df220919-8588-4611-86ba-ee251f810b74
Hardcover	BOOK48-HC	499.00	599.00	7	208	f	2025-12-17 18:10:10.737844	2025-12-17 18:10:10.737844	62371714-9a12-436e-99ba-c13cf903c856	df220919-8588-4611-86ba-ee251f810b74
Ebook	BOOK48-EB	199.00	249.00	999	208	t	2025-12-17 18:10:10.737844	2025-12-17 18:10:10.737844	345f1773-ce8d-44f8-a937-81292a8ac6ef	df220919-8588-4611-86ba-ee251f810b74
Paperback	TKAM-PB-002	1799.99	2399.99	40	586	f	2025-12-29 14:41:40.851914	2025-12-29 14:41:40.851914	b8bfa6ab-6757-4faf-b857-caaf6c266bba	76507564-387b-40f5-a024-9a5c9ae57b22
\.


--
-- Data for Name: books; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.books (title, subtitle, description, genre, edition, series, publisher, publication_date, author_bio, isbn10, isbn13, created_at, updated_at, authors, tags, awards, images, id) FROM stdin;
Naruto, Vol. 1	Uzumaki Naruto	The journey of Naruto begins.	Manga	1st Edition	Naruto Series	VIZ Media	2003-08-06	Masashi Kishimoto is a Japanese manga artist.	1569319006	9781569319000	2025-12-17 18:10:10.639671	2025-12-17 18:10:10.639671	{"Masashi Kishimoto"}	{action}	{}	{"back": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600819/back_cxt0ej.png", "cover": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600813/cover_firqeq.png", "interior": ["https://res.cloudinary.com/dirii8ccg/image/upload/v1764600818/interior_vkk6uu.png"]}	8a949e86-4b60-4d02-8054-373673a04c28
One Piece, Vol. 1	Romance Dawn	Luffy dreams of becoming the Pirate King.	Manga	1st Edition	One Piece	VIZ Media	2003-06-01	Eiichiro Oda is a Japanese manga artist.	1569319014	9781569319017	2025-12-17 18:10:10.653351	2025-12-17 18:10:10.653351	{"Eiichiro Oda"}	{adventure}	{}	{"back": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600819/back_cxt0ej.png", "cover": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600813/cover_firqeq.png", "interior": ["https://res.cloudinary.com/dirii8ccg/image/upload/v1764600818/interior_vkk6uu.png"]}	66f707cc-d4ad-432f-911b-67b3d94134fb
Demon Slayer, Vol. 1	Cruelty	Tanjiro begins his demon-hunting journey.	Manga	1st Edition	Demon Slayer	VIZ Media	2018-07-03	Gotouge is a Japanese manga artist.	1974700530	9781974700530	2025-12-17 18:10:10.656767	2025-12-17 18:10:10.656767	{"Koyoharu Gotouge"}	{"dark fantasy"}	{}	{"back": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600819/back_cxt0ej.png", "cover": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600813/cover_firqeq.png", "interior": ["https://res.cloudinary.com/dirii8ccg/image/upload/v1764600818/interior_vkk6uu.png"]}	1e8ba02e-a7ca-431d-b761-f53d699ebce9
Jujutsu Kaisen, Vol. 1	Ryomen Sukuna	Yuji Itadori enters the world of curses.	Manga	1st Edition	Jujutsu Kaisen	VIZ Media	2019-12-03	Gege Akutami is a Japanese manga artist.	1974710020	9781974710027	2025-12-17 18:10:10.659409	2025-12-17 18:10:10.659409	{"Gege Akutami"}	{supernatural}	{}	{"back": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600819/back_cxt0ej.png", "cover": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600813/cover_firqeq.png", "interior": ["https://res.cloudinary.com/dirii8ccg/image/upload/v1764600818/interior_vkk6uu.png"]}	9258c6d4-46fc-4399-abde-ca2c4b8a5832
Attack on Titan, Vol. 1		Humanity fights Titans.	Manga	1st Edition	Attack on Titan	Kodansha	2012-03-06	Isayama is a Japanese manga artist.	1612620248	9781612620244	2025-12-17 18:10:10.66182	2025-12-17 18:10:10.66182	{"Hajime Isayama"}	{post-apocalyptic}	{}	{"back": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600819/back_cxt0ej.png", "cover": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600813/cover_firqeq.png", "interior": ["https://res.cloudinary.com/dirii8ccg/image/upload/v1764600818/interior_vkk6uu.png"]}	ff9c21fd-758e-4c26-b2d9-a893c766b6e1
Death Note, Vol. 1	Boredom	Light discovers the Death Note.	Manga	1st Edition	Death Note	VIZ Media	2005-10-10	Ohba is a mysterious manga writer.	1421501686	9781421501680	2025-12-17 18:10:10.664034	2025-12-17 18:10:10.664034	{"Tsugumi Ohba"}	{psychological}	{}	{"back": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600819/back_cxt0ej.png", "cover": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600813/cover_firqeq.png", "interior": ["https://res.cloudinary.com/dirii8ccg/image/upload/v1764600818/interior_vkk6uu.png"]}	f862ce07-6c59-44d9-95a3-f52782ccf72b
Chainsaw Man, Vol. 1	Dog & Chainsaw	Denji merges with Chainsaw Devil.	Manga	1st Edition	Chainsaw Man	VIZ Media	2020-10-06	Fujimoto is known for dark storytelling.	1974709930	9781974709930	2025-12-17 18:10:10.66599	2025-12-17 18:10:10.66599	{"Tatsuki Fujimoto"}	{horror}	{}	{"back": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600819/back_cxt0ej.png", "cover": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600813/cover_firqeq.png", "interior": ["https://res.cloudinary.com/dirii8ccg/image/upload/v1764600818/interior_vkk6uu.png"]}	c52f40dc-49f8-4cf1-9404-b4a322a487ad
Tokyo Ghoul, Vol. 1		Kaneki becomes half-ghoul.	Manga	1st Edition	Tokyo Ghoul	VIZ Media	2015-06-16	Ishida is a Japanese manga creator.	1421580365	9781421580364	2025-12-17 18:10:10.667843	2025-12-17 18:10:10.667843	{"Sui Ishida"}	{dark}	{}	{"back": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600819/back_cxt0ej.png", "cover": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600813/cover_firqeq.png", "interior": ["https://res.cloudinary.com/dirii8ccg/image/upload/v1764600818/interior_vkk6uu.png"]}	46a283d2-7c2c-4a02-8da6-d36998489210
Blue Lock, Vol. 1		Elite striker program in Japan begins.	Sports Manga	1st Edition	Blue Lock	Kodansha	2022-03-22	Kaneshiro is a Japanese writer.	1646516543	9781646516544	2025-12-17 18:10:10.669609	2025-12-17 18:10:10.669609	{"Muneyuki Kaneshiro"}	{sports}	{}	{"back": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600819/back_cxt0ej.png", "cover": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600813/cover_firqeq.png", "interior": ["https://res.cloudinary.com/dirii8ccg/image/upload/v1764600818/interior_vkk6uu.png"]}	2b21b08b-f053-4749-a7ea-345b977353b2
My Hero Academia, Vol. 1		Izuku wants to be a hero.	Manga	1st Edition	MHA	VIZ Media	2015-08-04	Horikoshi is a Japanese manga artist.	1421582694	9781421582696	2025-12-17 18:10:10.671274	2025-12-17 18:10:10.671274	{"Kohei Horikoshi"}	{superhero}	{}	{"back": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600819/back_cxt0ej.png", "cover": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600813/cover_firqeq.png", "interior": ["https://res.cloudinary.com/dirii8ccg/image/upload/v1764600818/interior_vkk6uu.png"]}	930ee418-f693-4144-b7f8-ed4ed63c5aed
Harry Potter and the Philosopher's Stone		Harry enters Hogwarts.	Fantasy	1st Edition	Harry Potter	Bloomsbury	1997-06-26	Rowling is a British author.	0747532699	9780747532743	2025-12-17 18:10:10.672667	2025-12-17 18:10:10.672667	{"J.K. Rowling"}	{magic}	{}	{"back": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600819/back_cxt0ej.png", "cover": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600813/cover_firqeq.png", "interior": ["https://res.cloudinary.com/dirii8ccg/image/upload/v1764600818/interior_vkk6uu.png"]}	0cb1caf5-abbe-4230-b4af-8516dd3b0731
The Hobbit	There and Back Again	Bilbo joins a quest.	Fantasy	1st Edition	Middle Earth	Allen & Unwin	1937-09-21	Tolkien is father of modern fantasy.	0345339681	9780345339683	2025-12-17 18:10:10.674128	2025-12-17 18:10:10.674128	{"J.R.R. Tolkien"}	{adventure}	{}	{"back": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600819/back_cxt0ej.png", "cover": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600813/cover_firqeq.png", "interior": ["https://res.cloudinary.com/dirii8ccg/image/upload/v1764600818/interior_vkk6uu.png"]}	76408d56-c536-4ce1-852b-651053aabc84
The Alchemist		Santiago searches for his destiny.	Fiction	1st Edition		HarperTorch	1988-05-01	Coelho is a Brazilian novelist.	0061122416	9780061122415	2025-12-17 18:10:10.676946	2025-12-17 18:10:10.676946	{"Paulo Coelho"}	{inspirational}	{}	{"back": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600819/back_cxt0ej.png", "cover": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600813/cover_firqeq.png", "interior": ["https://res.cloudinary.com/dirii8ccg/image/upload/v1764600818/interior_vkk6uu.png"]}	9a0b7e4c-09f8-4399-abc7-9fae8ed4deb4
The Hunger Games		Katniss fights in deadly games.	Dystopian	1st Edition	Hunger Games	Scholastic	2008-09-14	Collins is an American novelist.	0439023483	9780439023481	2025-12-17 18:10:10.681687	2025-12-17 18:10:10.681687	{"Suzanne Collins"}	{dystopia}	{}	{"back": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600819/back_cxt0ej.png", "cover": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600813/cover_firqeq.png", "interior": ["https://res.cloudinary.com/dirii8ccg/image/upload/v1764600818/interior_vkk6uu.png"]}	5c361244-b3fa-4f71-9100-26b1adef393a
The Fault in Our Stars		A love story between teens with cancer.	Romance	1st Edition		Dutton	2012-01-10	Green is an American author.	0525478817	9780525478812	2025-12-17 18:10:10.683285	2025-12-17 18:10:10.683285	{"John Green"}	{romance}	{}	{"back": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600819/back_cxt0ej.png", "cover": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600813/cover_firqeq.png", "interior": ["https://res.cloudinary.com/dirii8ccg/image/upload/v1764600818/interior_vkk6uu.png"]}	ad8419f3-ee34-4028-9e2d-fa7d94a68c29
Percy Jackson: The Lightning Thief		Percy discovers he is a demigod.	Fantasy	1st Edition	Percy Jackson	Disney Hyperion	2005-06-28	Riordan writes mythology adventures.	0786838655	9780786838653	2025-12-17 18:10:10.685109	2025-12-17 18:10:10.685109	{"Rick Riordan"}	{mythology}	{}	{"back": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600819/back_cxt0ej.png", "cover": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600813/cover_firqeq.png", "interior": ["https://res.cloudinary.com/dirii8ccg/image/upload/v1764600818/interior_vkk6uu.png"]}	bfb624aa-c470-4676-9d20-16f55db52e35
Lord of the Rings: Fellowship of the Ring		Frodo begins the journey to destroy the One Ring.	Fantasy	1st Edition	LOTR	Allen & Unwin	1954-07-29	Tolkien is a legendary author.	0395489318	9780395489314	2025-12-17 18:10:10.686558	2025-12-17 18:10:10.686558	{"J.R.R. Tolkien"}	{"epic fantasy"}	{}	{"back": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600819/back_cxt0ej.png", "cover": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600813/cover_firqeq.png", "interior": ["https://res.cloudinary.com/dirii8ccg/image/upload/v1764600818/interior_vkk6uu.png"]}	38104952-787e-44f7-bf19-db04ced2fd3e
Sherlock Holmes: A Study in Scarlet		The first Sherlock Holmes case.	Mystery	1st Edition	Sherlock Holmes	Ward Lock	1887-11-01	Doyle is a British writer.	1508475311	9781508475318	2025-12-17 18:10:10.687828	2025-12-17 18:10:10.687828	{"Arthur Conan Doyle"}	{detective}	{}	{"back": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600819/back_cxt0ej.png", "cover": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600813/cover_firqeq.png", "interior": ["https://res.cloudinary.com/dirii8ccg/image/upload/v1764600818/interior_vkk6uu.png"]}	2e0530b8-10b6-42be-b030-5a20d947374c
1984		A dystopian future under total surveillance.	Dystopian	1st Edition		Secker & Warburg	1949-06-08	Orwell is a British novelist.	0451524934	9780451524935	2025-12-17 18:10:10.689258	2025-12-17 18:10:10.689258	{"George Orwell"}	{dystopia}	{}	{"back": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600819/back_cxt0ej.png", "cover": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600813/cover_firqeq.png", "interior": ["https://res.cloudinary.com/dirii8ccg/image/upload/v1764600818/interior_vkk6uu.png"]}	02a3aef6-0e3c-4815-b361-323a558e2931
To Kill a Mockingbird		A powerful story of justice and racism.	Fiction	1st Edition		J.B. Lippincott	1960-07-11	Lee is an American novelist.	0446310786	9780446310789	2025-12-17 18:10:10.690875	2025-12-17 18:10:10.690875	{"Harper Lee"}	{classic}	{}	{"back": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600819/back_cxt0ej.png", "cover": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600813/cover_firqeq.png", "interior": ["https://res.cloudinary.com/dirii8ccg/image/upload/v1764600818/interior_vkk6uu.png"]}	2f63bc7e-2b8a-499a-9518-8bd4a65bce37
Clean Code		A guide to writing clean software.	Programming	1st Edition		Prentice Hall	2008-08-01	Martin is a software engineer.	0132350882	9780132350884	2025-12-17 18:10:10.692396	2025-12-17 18:10:10.692396	{"Robert C. Martin"}	{software}	{}	{"back": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600819/back_cxt0ej.png", "cover": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600813/cover_firqeq.png", "interior": ["https://res.cloudinary.com/dirii8ccg/image/upload/v1764600818/interior_vkk6uu.png"]}	64a1787d-721a-4290-86c3-809508d81700
You Don't Know JS: Scope & Closures		Deep dive on JavaScript internals.	Programming	1st Edition	YDKJS	O'Reilly	2014-03-10	Simpson writes JS books.	1491904151	9781491904152	2025-12-17 18:10:10.694222	2025-12-17 18:10:10.694222	{"Kyle Simpson"}	{javascript}	{}	{"back": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600819/back_cxt0ej.png", "cover": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600813/cover_firqeq.png", "interior": ["https://res.cloudinary.com/dirii8ccg/image/upload/v1764600818/interior_vkk6uu.png"]}	fb24ea39-490e-4f12-97b5-aa4ce0632e5e
Eloquent JavaScript		A modern introduction to JavaScript.	Programming	3rd Edition		No Starch Press	2018-12-04	Haverbeke is a programmer.	1593279507	9781593279509	2025-12-17 18:10:10.696624	2025-12-17 18:10:10.696624	{"Marijn Haverbeke"}	{javascript}	{}	{"back": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600819/back_cxt0ej.png", "cover": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600813/cover_firqeq.png", "interior": ["https://res.cloudinary.com/dirii8ccg/image/upload/v1764600818/interior_vkk6uu.png"]}	6653eb77-884e-4d9d-96de-9e498e339788
Designing Data-Intensive Applications		Modern data systems explained.	Technology	1st Edition		O'Reilly	2017-04-02	Kleppmann is a researcher.	1449373321	9781449373320	2025-12-17 18:10:10.697841	2025-12-17 18:10:10.697841	{"Martin Kleppmann"}	{"system design"}	{}	{"back": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600819/back_cxt0ej.png", "cover": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600813/cover_firqeq.png", "interior": ["https://res.cloudinary.com/dirii8ccg/image/upload/v1764600818/interior_vkk6uu.png"]}	b7793fbe-88b2-4735-ad0e-2ac87c1af64c
Introduction to Algorithms		The classic algorithms textbook.	Computer Science	3rd Edition	CLRS	MIT Press	2009-07-31	Cormen is a CS professor.	0262033844	9780262033848	2025-12-17 18:10:10.699646	2025-12-17 18:10:10.699646	{"Thomas H. Cormen"}	{algorithms}	{}	{"back": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600819/back_cxt0ej.png", "cover": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600813/cover_firqeq.png", "interior": ["https://res.cloudinary.com/dirii8ccg/image/upload/v1764600818/interior_vkk6uu.png"]}	e98e2d83-240c-4233-bcdb-2fc68028787e
The Pragmatic Programmer		Timeless software development wisdom.	Programming	1st Edition		Addison-Wesley	1999-10-20	Hunt is a software engineer.	020161622X	9780201616224	2025-12-17 18:10:10.700911	2025-12-17 18:10:10.700911	{"Andrew Hunt","David Thomas"}	{software}	{}	{"back": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600819/back_cxt0ej.png", "cover": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600813/cover_firqeq.png", "interior": ["https://res.cloudinary.com/dirii8ccg/image/upload/v1764600818/interior_vkk6uu.png"]}	a4714ac1-e835-49b8-97ec-3cdc9119a971
Cracking the Coding Interview		Coding interview preparation.	Programming	6th Edition		CareerCup	2015-07-01	Gayle is a former Google engineer.	0984782850	9780984782857	2025-12-17 18:10:10.70234	2025-12-17 18:10:10.70234	{"Gayle Laakmann McDowell"}	{interview}	{}	{"back": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600819/back_cxt0ej.png", "cover": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600813/cover_firqeq.png", "interior": ["https://res.cloudinary.com/dirii8ccg/image/upload/v1764600818/interior_vkk6uu.png"]}	01b46b5e-352e-45d8-99b1-1250c58d20f5
Refactoring		Improving design of existing code.	Programming	2nd Edition		Addison-Wesley	2018-11-19	Fowler is a software architect.	0134757599	9780134757599	2025-12-17 18:10:10.704621	2025-12-17 18:10:10.704621	{"Martin Fowler"}	{software}	{}	{"back": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600819/back_cxt0ej.png", "cover": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600813/cover_firqeq.png", "interior": ["https://res.cloudinary.com/dirii8ccg/image/upload/v1764600818/interior_vkk6uu.png"]}	5d1fbda4-cac6-4e21-b82b-faf587375acc
Head First Design Patterns		A beginner-friendly guide to design patterns.	Programming	1st Edition		O'Reilly	2004-10-25	Freeman is an author and engineer.	0596007124	9780596007126	2025-12-17 18:10:10.70617	2025-12-17 18:10:10.70617	{"Eric Freeman"}	{"design patterns"}	{}	{"back": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600819/back_cxt0ej.png", "cover": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600813/cover_firqeq.png", "interior": ["https://res.cloudinary.com/dirii8ccg/image/upload/v1764600818/interior_vkk6uu.png"]}	189fbf2d-08dd-4c0d-bd5a-f0181065c471
Python Crash Course		Hands-on Python introduction.	Programming	2nd Edition		No Starch Press	2019-05-03	Matthes is a programmer.	1593279280	9781593279288	2025-12-17 18:10:10.70767	2025-12-17 18:10:10.70767	{"Eric Matthes"}	{python}	{}	{"back": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600819/back_cxt0ej.png", "cover": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600813/cover_firqeq.png", "interior": ["https://res.cloudinary.com/dirii8ccg/image/upload/v1764600818/interior_vkk6uu.png"]}	3cb9abf8-b14a-4f6c-a672-54d705812f7d
Atomic Habits		A guide to building good habits.	Self-help	1st Edition		Penguin	2018-10-16	Clear is a habits expert.	0735211299	9780735211292	2025-12-17 18:10:10.709023	2025-12-17 18:10:10.709023	{"James Clear"}	{self-help}	{}	{"back": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600819/back_cxt0ej.png", "cover": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600813/cover_firqeq.png", "interior": ["https://res.cloudinary.com/dirii8ccg/image/upload/v1764600818/interior_vkk6uu.png"]}	803c8edd-c28c-4fcb-ae2f-df021c10fd3c
Rich Dad Poor Dad		Lessons on money and investing.	Finance	1st Edition		Plata Publishing	1997-04-01	Kiyosaki is an investor.	1612680194	9781612680194	2025-12-17 18:10:10.710431	2025-12-17 18:10:10.710431	{"Robert Kiyosaki"}	{finance}	{}	{"back": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600819/back_cxt0ej.png", "cover": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600813/cover_firqeq.png", "interior": ["https://res.cloudinary.com/dirii8ccg/image/upload/v1764600818/interior_vkk6uu.png"]}	1381a381-2938-49e2-b521-ffdaf7ae445a
The Psychology of Money		Timeless lessons about money.	Finance	1st Edition		Harriman House	2020-09-08	Housel is a finance writer.	0857197681	9780857197689	2025-12-17 18:10:10.711993	2025-12-17 18:10:10.711993	{"Morgan Housel"}	{finance}	{}	{"back": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600819/back_cxt0ej.png", "cover": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600813/cover_firqeq.png", "interior": ["https://res.cloudinary.com/dirii8ccg/image/upload/v1764600818/interior_vkk6uu.png"]}	efe48fda-e938-4c48-9a57-5bc7257de23e
Think and Grow Rich		Principles of success and mindset.	Self-help	1st Edition		The Ralston Society	1937-08-01	Hill is a motivational writer.	1585424331	9781585424337	2025-12-17 18:10:10.713626	2025-12-17 18:10:10.713626	{"Napoleon Hill"}	{mindset}	{}	{"back": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600819/back_cxt0ej.png", "cover": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600813/cover_firqeq.png", "interior": ["https://res.cloudinary.com/dirii8ccg/image/upload/v1764600818/interior_vkk6uu.png"]}	ebbdee85-a89c-47a9-bccd-9bab46db8752
Deep Work		Rules for focused success.	Productivity	1st Edition		Grand Central	2016-01-05	Newport is a CS professor.	1455586692	9781455586691	2025-12-17 18:10:10.715082	2025-12-17 18:10:10.715082	{"Cal Newport"}	{productivity}	{}	{"back": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600819/back_cxt0ej.png", "cover": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600813/cover_firqeq.png", "interior": ["https://res.cloudinary.com/dirii8ccg/image/upload/v1764600818/interior_vkk6uu.png"]}	34262cbc-ce23-462b-ad26-3cd0178daad1
The Subtle Art of Not Giving a F*ck		A counterintuitive approach to living well.	Self-help	1st Edition		Harper	2016-09-13	Manson is a blogger and author.	0062457713	9780062457714	2025-12-17 18:10:10.716348	2025-12-17 18:10:10.716348	{"Mark Manson"}	{self-help}	{}	{"back": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600819/back_cxt0ej.png", "cover": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600813/cover_firqeq.png", "interior": ["https://res.cloudinary.com/dirii8ccg/image/upload/v1764600818/interior_vkk6uu.png"]}	66c22bf9-3276-4c58-911d-92791c763d1d
Sapiens	A Brief History of Humankind	The story of humankind.	History	1st Edition		Harper	2011-06-04	Harari is a historian.	0062316095	9780062316097	2025-12-17 18:10:10.717893	2025-12-17 18:10:10.717893	{"Yuval Noah Harari"}	{history}	{}	{"back": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600819/back_cxt0ej.png", "cover": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600813/cover_firqeq.png", "interior": ["https://res.cloudinary.com/dirii8ccg/image/upload/v1764600818/interior_vkk6uu.png"]}	506ac6ff-7859-46e9-9462-6596f6ba0ea6
Ikigai	The Japanese Secret to a Long and Happy Life	Finding purpose through Ikigai.	Self-help	1st Edition		Penguin	2016-01-01	Both are authors and researchers.	0143130722	9780143130727	2025-12-17 18:10:10.719298	2025-12-17 18:10:10.719298	{"Héctor García","Francesc Miralles"}	{self-help}	{}	{"back": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600819/back_cxt0ej.png", "cover": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600813/cover_firqeq.png", "interior": ["https://res.cloudinary.com/dirii8ccg/image/upload/v1764600818/interior_vkk6uu.png"]}	630fc197-b688-4e4a-8637-13f332c1c121
Man’s Search for Meaning		A memoir of finding meaning.	Psychology	1st Edition		Beacon Press	1946-01-01	Frankl was a psychiatrist.	0807014273	9780807014271	2025-12-17 18:10:10.720726	2025-12-17 18:10:10.720726	{"Viktor E. Frankl"}	{psychology}	{}	{"back": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600819/back_cxt0ej.png", "cover": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600813/cover_firqeq.png", "interior": ["https://res.cloudinary.com/dirii8ccg/image/upload/v1764600818/interior_vkk6uu.png"]}	c271bcae-0350-4d46-9807-701dc61364af
The Power of Habit		Understanding the science of habits.	Self-help	1st Edition		Random House	2012-02-28	Duhigg is a journalist.	1400069289	9781400069286	2025-12-17 18:10:10.72331	2025-12-17 18:10:10.72331	{"Charles Duhigg"}	{psychology}	{}	{"back": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600819/back_cxt0ej.png", "cover": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600813/cover_firqeq.png", "interior": ["https://res.cloudinary.com/dirii8ccg/image/upload/v1764600818/interior_vkk6uu.png"]}	0d55a4a4-dbf8-4832-8fe0-975fed5de3a0
Batman: Year One		Batman's origin story reimagined.	Comics	1st Edition	Batman	DC Comics	1987-02-01	Miller is a comic legend.	1401207529	9781401207526	2025-12-17 18:10:10.724625	2025-12-17 18:10:10.724625	{"Frank Miller"}	{superhero}	{}	{"back": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600819/back_cxt0ej.png", "cover": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600813/cover_firqeq.png", "interior": ["https://res.cloudinary.com/dirii8ccg/image/upload/v1764600818/interior_vkk6uu.png"]}	c5c2ea3a-57a2-4e0a-b736-58e01dda0ac8
Watchmen		A dark look at costumed heroes.	Comics	1st Edition		DC Comics	1986-09-01	Moore is a graphic novelist.	0930289234	9780930289232	2025-12-17 18:10:10.727078	2025-12-17 18:10:10.727078	{"Alan Moore"}	{superhero}	{}	{"back": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600819/back_cxt0ej.png", "cover": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600813/cover_firqeq.png", "interior": ["https://res.cloudinary.com/dirii8ccg/image/upload/v1764600818/interior_vkk6uu.png"]}	31c29ee4-18ec-4fd3-bf22-419edec62530
Spider-Man: Blue		Peter Parker reflects on Gwen Stacy.	Comics	1st Edition	Spider-Man	Marvel	2002-07-01	Loeb is a comics writer.	0785110707	9780785110705	2025-12-17 18:10:10.728849	2025-12-17 18:10:10.728849	{"Jeph Loeb"}	{superhero}	{}	{"back": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600819/back_cxt0ej.png", "cover": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600813/cover_firqeq.png", "interior": ["https://res.cloudinary.com/dirii8ccg/image/upload/v1764600818/interior_vkk6uu.png"]}	34786406-2a02-4336-a7f1-35c42c133a3c
The Walking Dead, Vol. 1	Days Gone Bye	A zombie outbreak survival tale.	Comics	1st Edition	Walking Dead	Image Comics	2004-05-10	Kirkman is a comic creator.	1582406723	9781582406725	2025-12-17 18:10:10.731007	2025-12-17 18:10:10.731007	{"Robert Kirkman"}	{zombies}	{}	{"back": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600819/back_cxt0ej.png", "cover": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600813/cover_firqeq.png", "interior": ["https://res.cloudinary.com/dirii8ccg/image/upload/v1764600818/interior_vkk6uu.png"]}	e8afea21-46cb-4c32-b494-af3ce83028ff
X-Men: Dark Phoenix Saga		Jean Grey becomes the Phoenix.	Comics	1st Edition	X-Men	Marvel	1980-01-01	Claremont is a comics writer.	0785108188	9780785108184	2025-12-17 18:10:10.732652	2025-12-17 18:10:10.732652	{"Chris Claremont"}	{superhero}	{}	{"back": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600819/back_cxt0ej.png", "cover": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600813/cover_firqeq.png", "interior": ["https://res.cloudinary.com/dirii8ccg/image/upload/v1764600818/interior_vkk6uu.png"]}	93e24524-4dfc-4bde-ae68-a79881b77a4f
V for Vendetta		A rebellion against a totalitarian regime.	Comics	1st Edition		Vertigo	1988-03-01	Moore is a graphic novelist.	1401207928	9781401207922	2025-12-17 18:10:10.734354	2025-12-17 18:10:10.734354	{"Alan Moore"}	{dystopia}	{}	{"back": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600819/back_cxt0ej.png", "cover": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600813/cover_firqeq.png", "interior": ["https://res.cloudinary.com/dirii8ccg/image/upload/v1764600818/interior_vkk6uu.png"]}	1ef1aec4-6403-4558-a46b-237f7feea57d
Saga, Vol. 1		A space opera about forbidden love.	Comics	1st Edition	Saga	Image Comics	2012-10-23	Vaughan is a writer.	1607066017	9781607066019	2025-12-17 18:10:10.736087	2025-12-17 18:10:10.736087	{"Brian K. Vaughan"}	{sci-fi}	{}	{"back": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600819/back_cxt0ej.png", "cover": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600813/cover_firqeq.png", "interior": ["https://res.cloudinary.com/dirii8ccg/image/upload/v1764600818/interior_vkk6uu.png"]}	d7e4085d-0949-4ecb-b8a1-d85d618c7efa
Civil War		A conflict between heroes over freedom vs safety.	Comics	1st Edition	Marvel Events	Marvel	2007-01-01	Millar is a comics writer.	078512179X	9780785121794	2025-12-17 18:10:10.737844	2025-12-17 18:10:10.737844	{"Mark Millar"}	{superhero}	{}	{"back": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600819/back_cxt0ej.png", "cover": "https://res.cloudinary.com/dirii8ccg/image/upload/v1764600813/cover_firqeq.png", "interior": ["https://res.cloudinary.com/dirii8ccg/image/upload/v1764600818/interior_vkk6uu.png"]}	df220919-8588-4611-86ba-ee251f810b74
Vagabond Vol. 1		A prestige treatment of Inoue’s epic samurai series with bonus content, color pages, storyboard samples and more! Real-life figure Miyamoto Musashi was the most celebrated samurai of all time. The quintessential warrior-philosopher, Musashi authored A Book of Five Rings, a classic treatise in the canon of world philosophy and military strategy. But the path to enlightenment is an endless journey, and to get there through violent means--by way of the sword--makes mere survival an even greater challenge.	Manga	PaperBack	Vagabond	Viz Media	2025-12-29	Takehiko Inoue is a Japanese manga artist. He is best known for the basketball series Slam Dunk (1990–1996), and the jidaigeki manga Vagabond, which are two of the best-selling manga series in history. Many of his works are about basketball, Inoue hiself being a huge fan of the sport. His works sold in North America through Viz Media are Slam Dunk, Vagabond and Real, although Slam Dunk was earlier translated by Gutsoon! Entertainment. In 2012, Inoue became the first recipient of the Cultural Prize at the Asia Cosmopolitan Awards. In 2024, Inoue received the MEXT Arts Encouragement Prize.	1421520540	9781421520544	2025-12-29 14:41:40.851914	2025-12-29 14:41:40.851914	{"Takehiko Inoue"}	{Mange,Survival,Fighting,Seinen}	{"no award"}	{"back": "https://res.cloudinary.com/dirii8ccg/image/upload/v1766999499/E-commerce/books/auewhip91gpt7ylrqkt1.webp", "cover": "https://res.cloudinary.com/dirii8ccg/image/upload/v1766999498/E-commerce/books/c1owzgdn6bicwpknpk1n.webp", "interior": []}	76507564-387b-40f5-a024-9a5c9ae57b22
\.


--
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_items (id, user_id, format_id, quantity, created_at) FROM stdin;
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_items (id, order_id, book_id, format_id, price, quantity) FROM stdin;
ff0ba246-f783-4357-97c4-48238df8f107	4d77968a-58bf-42c9-9476-e6e83d1516b7	ff9c21fd-758e-4c26-b2d9-a893c766b6e1	a133e350-a711-4578-8207-f8df20670ec5	299.00	1
351acb1e-1503-419e-8abd-9859e5bd5aba	4d738b5b-d0ef-4d17-9293-625fdea6c43c	ff9c21fd-758e-4c26-b2d9-a893c766b6e1	6b66c6e4-247b-4ff7-a97a-5c3b79ac89b5	499.00	1
f7e7ee10-7259-4f59-9a29-e97d7de7577e	4d738b5b-d0ef-4d17-9293-625fdea6c43c	fb24ea39-490e-4f12-97b5-aa4ce0632e5e	19198b86-2b8a-4139-8f61-47e5c431ba31	299.00	1
e13017b1-8407-4926-9e3b-a6b07226d991	4d738b5b-d0ef-4d17-9293-625fdea6c43c	efe48fda-e938-4c48-9a57-5bc7257de23e	20c733c7-3377-4069-a463-1ef7a6464d13	499.00	1
4b7db9e4-20f8-4b52-ba4c-519a1922a54c	bd4d2366-937a-4d06-8304-6e3a0caab711	f862ce07-6c59-44d9-95a3-f52782ccf72b	12399676-5e42-4f64-bce3-054659f62197	299.00	1
34313fbe-8449-408b-9ac7-9b65d6bf9364	bd4d2366-937a-4d06-8304-6e3a0caab711	f862ce07-6c59-44d9-95a3-f52782ccf72b	4ced5ab8-3e81-49b7-a623-e1f100173c8d	499.00	1
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, user_id, total_amount, status, created_at) FROM stdin;
4d77968a-58bf-42c9-9476-e6e83d1516b7	99ff14c8-d300-4657-b566-269feaeb465d	299.00	paid	2026-01-09 17:34:33.11856
4d738b5b-d0ef-4d17-9293-625fdea6c43c	99ff14c8-d300-4657-b566-269feaeb465d	1297.00	paid	2026-01-09 17:40:49.049263
bd4d2366-937a-4d06-8304-6e3a0caab711	99ff14c8-d300-4657-b566-269feaeb465d	798.00	paid	2026-01-09 18:05:33.088684
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password, created_at, updated_at, favorites, cart, refresh_token, address) FROM stdin;
21a966cb-af2a-4745-8d8a-fc2c1f114139	kartik	test1@gmail.com	$2b$10$GmC9ESAXu8DWnJNYbhRNh.D5Wc5UgdkV47eru4avzFHBVDs6SVZYy	2025-11-20 23:23:05.220422	2025-11-20 23:23:05.220422	\N	[]	\N	{}
a2a026e4-9255-489e-b8d8-4a211ee440da	kartik kumar	example@gmail.com	$2b$10$HggFfUaMAp/TqGORNgzzregujW79TuBbXUYZrpoQbEtyLCbMdouvy	2026-01-02 22:24:56.974727	2026-01-02 22:24:56.974727	\N	[]	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImV4YW1wbGVAZ21haWwuY29tIiwiaWQiOiJhMmEwMjZlNC05MjU1LTQ4OWUtYjhkOC00YTIxMWVlNDQwZGEiLCJpYXQiOjE3NjczNzQwNjAsImV4cCI6MTc2Nzk3ODg2MH0.d8omZJDrqdcofcDW1J9it0j9PumYSWoRSccMR-nvJtI	{}
a67c3f2f-fb7a-4069-aea4-c1667906e4a0	Kartik	testing@gmail.com	$2b$10$YV9ewtbtrTU4IJ5zl45xcObAdUtjIBahFhuIIf4Lel6kwRxSYuScK	2025-12-16 20:21:14.308365	2025-12-16 20:21:14.308365	\N	[]	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RpbmdAZ21haWwuY29tIiwiaWQiOiJhNjdjM2YyZi1mYjdhLTQwNjktYWVhNC1jMTY2NzkwNmU0YTAiLCJpYXQiOjE3NjYwNTgyMjAsImV4cCI6MTc2NjY2MzAyMH0.peU7L5a9ysHyVoiFRRQCKZqc1HvxPGNZ4gmA430uj3c	{}
99ff14c8-d300-4657-b566-269feaeb465d	kartik	test@gmail.com	$2b$10$ablvT5y.WokensaqMjVeJeXr2Rjxn10aQd1cU.tO/ErPl3jgZvGcm	2025-11-19 12:15:01.770587	2025-11-19 12:15:01.770587	["fb24ea39-490e-4f12-97b5-aa4ce0632e5e"]	["efe48fda-e938-4c48-9a57-5bc7257de23e", "f862ce07-6c59-44d9-95a3-f52782ccf72b", "fb24ea39-490e-4f12-97b5-aa4ce0632e5e", "ff9c21fd-758e-4c26-b2d9-a893c766b6e1"]	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZ21haWwuY29tIiwiaWQiOiI5OWZmMTRjOC1kMzAwLTQ2NTctYjU2Ni0yNjlmZWFlYjQ2NWQiLCJpYXQiOjE3Njc0NDU4NDAsImV4cCI6MTc2ODA1MDY0MH0.drllU7aQu7QWxPsemkA9WQeaBu_ok_ugxHJfDI84HaM	{}
\.


--
-- Name: book_formats book_formats_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.book_formats
    ADD CONSTRAINT book_formats_pkey PRIMARY KEY (id);


--
-- Name: book_formats book_formats_sku_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.book_formats
    ADD CONSTRAINT book_formats_sku_key UNIQUE (sku);


--
-- Name: books books_isbn10_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_isbn10_key UNIQUE (isbn10);


--
-- Name: books books_isbn13_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_isbn13_key UNIQUE (isbn13);


--
-- Name: books books_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_pkey PRIMARY KEY (id);


--
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (id);


--
-- Name: cart_items cart_items_user_id_format_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_user_id_format_id_key UNIQUE (user_id, format_id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: books_subtitle_trgm_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX books_subtitle_trgm_idx ON public.books USING gin (subtitle public.gin_trgm_ops);


--
-- Name: idx_order_items_book_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_order_items_book_id ON public.order_items USING btree (book_id);


--
-- Name: idx_order_items_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_order_items_order_id ON public.order_items USING btree (order_id);


--
-- Name: idx_orders_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_orders_user_id ON public.orders USING btree (user_id);


--
-- Name: cart_items cart_items_format_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_format_id_fkey FOREIGN KEY (format_id) REFERENCES public.book_formats(id);


--
-- Name: cart_items cart_items_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: order_items fk_order_items_book; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT fk_order_items_book FOREIGN KEY (book_id) REFERENCES public.books(id) ON DELETE CASCADE;


--
-- Name: order_items fk_order_items_format; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT fk_order_items_format FOREIGN KEY (format_id) REFERENCES public.book_formats(id) ON DELETE CASCADE;


--
-- Name: order_items fk_order_items_order; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: orders fk_orders_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict bM14EIhidDzUjhll59OubOJFN5P9ng3UY8LIpugewmO9W6qh0TIBk0qrOnPMvfe

