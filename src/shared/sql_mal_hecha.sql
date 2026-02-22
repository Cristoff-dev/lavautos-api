-- Extensión necesaria para los IDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE SCHEMA IF NOT EXISTS auth;

-- 1. TABLAS BASE (Sin dependencias)
---------------------------------------------------------
CREATE TABLE auth.instances (
    id uuid NOT NULL PRIMARY KEY,
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);

CREATE TABLE auth.users (
    instance_id uuid,
    id uuid NOT NULL PRIMARY KEY,
    aud character varying,
    role character varying,
    email character varying,
    encrypted_password character varying,
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying,
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying,
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying,
    email_change character varying,
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text DEFAULT NULL UNIQUE,
    phone_confirmed_at timestamp with time zone,
    phone_change text DEFAULT '',
    phone_change_token character varying DEFAULT '',
    phone_change_sent_at timestamp with time zone,
    -- Columna corregida (sin el DEFAULT LEAST ilegal)
    confirmed_at timestamp with time zone, 
    email_change_token_current character varying DEFAULT '',
    email_change_confirm_status smallint DEFAULT 0 CHECK (email_change_confirm_status >= 0 AND email_change_confirm_status <= 2),
    banned_until timestamp with time zone,
    reauthentication_token character varying DEFAULT '',
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean NOT NULL DEFAULT false,
    deleted_at timestamp with time zone,
    is_anonymous boolean NOT NULL DEFAULT false
);

-- 2. LÓGICA DE TRIGGER PARA "confirmed_at"
---------------------------------------------------------
-- Esta función corrige el error que experimentaste
CREATE OR REPLACE FUNCTION auth.set_confirmed_at()
RETURNS TRIGGER AS $$
BEGIN
    -- LEAST devuelve el valor más pequeño ignorando NULLs si se usa correctamente, 
    -- o maneja la lógica de cuál confirmación ocurrió primero.
    NEW.confirmed_at := LEAST(NEW.email_confirmed_at, NEW.phone_confirmed_at);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_update_confirmed_at
BEFORE INSERT OR UPDATE ON auth.users
FOR EACH ROW
EXECUTE FUNCTION auth.set_confirmed_at();

-- 3. TABLAS DEPENDIENTES
---------------------------------------------------------
CREATE TABLE auth.oauth_clients (
    id uuid NOT NULL PRIMARY KEY,
    client_secret_hash text,
    registration_type text NOT NULL,
    redirect_uris text NOT NULL,
    grant_types text NOT NULL,
    client_name text CHECK (char_length(client_name) <= 1024),
    client_uri text CHECK (char_length(client_uri) <= 2048),
    logo_uri text CHECK (char_length(logo_uri) <= 2048),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    client_type text NOT NULL DEFAULT 'confidential',
    token_endpoint_auth_method text NOT NULL CHECK (token_endpoint_auth_method = ANY (ARRAY['client_secret_basic'::text, 'client_secret_post'::text, 'none'::text]))
);

CREATE TABLE auth.sessions (
    id uuid NOT NULL PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id),
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    factor_id uuid,
    aal text,
    not_after timestamp with time zone,
    refreshed_at timestamp without time zone,
    user_agent text,
    ip inet,
    tag text,
    oauth_client_id uuid REFERENCES auth.oauth_clients(id),
    refresh_token_hmac_key text,
    refresh_token_counter bigint,
    scopes text CHECK (char_length(scopes) <= 4096)
);

CREATE TABLE auth.mfa_factors (
    id uuid NOT NULL PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id),
    friendly_name text,
    factor_type text NOT NULL,
    status text NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    secret text,
    phone text,
    last_challenged_at timestamp with time zone UNIQUE,
    web_authn_credential jsonb,
    web_authn_aaguid uuid,
    last_webauthn_challenge_data jsonb
);

CREATE TABLE auth.refresh_tokens (
    instance_id uuid,
    id bigserial PRIMARY KEY,
    token character varying UNIQUE,
    user_id character varying,
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent character varying,
    session_id uuid REFERENCES auth.sessions(id)
);

-- (Puedes seguir añadiendo el resto de tablas aquí abajo)