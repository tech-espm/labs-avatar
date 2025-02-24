CREATE DATABASE avatar DEFAULT CHARACTER SET utf8mb4 DEFAULT COLLATE utf8mb4_0900_ai_ci;
USE avatar;

-- DROP TABLE IF EXISTS perfil;
CREATE TABLE perfil (
  id int NOT NULL AUTO_INCREMENT,
  nome varchar(50) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY nome_UN (nome)
);

-- Manter sincronizado com enums/perfil.ts e models/perfil.ts
INSERT INTO perfil (nome) VALUES ('Administrador'), ('Comum');

-- DROP TABLE IF EXISTS usuario;
CREATE TABLE usuario (
  id_usuario int NOT NULL AUTO_INCREMENT,
  email varchar(100) NOT NULL,
  nome varchar(100) NOT NULL,
  id_perfil int NOT NULL,
  senha varchar(100) NOT NULL,
  token char(32) DEFAULT NULL,
  exclusao datetime NULL,
  criacao datetime NOT NULL,
  PRIMARY KEY (id_usuario),
  UNIQUE KEY usuario_email_UN (email),
  KEY usuario_exclusao_IX (exclusao),
  KEY usuario_idperfil_FK_IX (id_perfil),
  CONSTRAINT usuario_idperfil_FK FOREIGN KEY (id_perfil) REFERENCES perfil (id) ON DELETE RESTRICT ON UPDATE RESTRICT
);

INSERT INTO usuario (email, nome, id_perfil, senha, token, criacao) VALUES ('admin@espm.br', 'Administrador', 1, 'NsSzgX9AXd2G85aiCOrUwAFkiEHrHYljYWpJBCfqOvKr:WD+jsEW/Dswcivs42EZBZREfm+4WaPcZHRPG5LJpD8yr', NULL, NOW());

CREATE TABLE curso (
  id_curso INT NOT NULL,
  nome VARCHAR(45) NOT NULL,
  PRIMARY KEY (id_curso)
);

CREATE TABLE persona (
  id_persona INT NOT NULL,
  nome VARCHAR(45) NOT NULL,
  id_curso INT NOT NULL,
  PRIMARY KEY (id_persona),
  INDEX fk_persona_curso1_idx (id_curso ASC) VISIBLE,
  CONSTRAINT fk_persona_curso1 FOREIGN KEY (id_curso) REFERENCES curso (id_curso) ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE pergunta (
  id_pergunta INT NOT NULL,
  descricao VARCHAR(500) NOT NULL,
  id_curso INT NOT NULL,
  ponto0 INT NOT NULL,
  ponto1 INT NOT NULL,
  ponto2 INT NOT NULL,
  ponto3 INT NOT NULL,
  ponto4 INT NOT NULL,
  ponto5 INT NOT NULL,
  ponto6 INT NOT NULL,
  ponto7 INT NOT NULL,
  PRIMARY KEY (id_pergunta),
  INDEX fk_pergunta_curso1_idx (id_curso ASC) VISIBLE,
  CONSTRAINT fk_pergunta_curso1 FOREIGN KEY (id_curso) REFERENCES curso (id_curso) ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE resultado_final (
  id_resultado_final INT NOT NULL AUTO_INCREMENT,
  id_usuario INT NOT NULL,
  data DATETIME NOT NULL,
  ponto0 INT NOT NULL,
  ponto1 INT NOT NULL,
  ponto2 INT NOT NULL,
  ponto3 INT NOT NULL,
  ponto4 INT NOT NULL,
  ponto5 INT NOT NULL,
  ponto6 INT NOT NULL,
  ponto7 INT NOT NULL,
  PRIMARY KEY (id_resultado_final),
  INDEX fk_resultado_final_usuario1_idx (id_usuario ASC) VISIBLE,
  CONSTRAINT fk_resultado_final_usuario1 FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario) ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE resposta (
  id_resposta INT NOT NULL AUTO_INCREMENT,
  id_pergunta INT NOT NULL,
  id_resultado_final INT NOT NULL,
  valor INT NOT NULL,
  PRIMARY KEY (id_resposta),
  INDEX fk_resposta_pergunta1_idx (id_pergunta ASC) VISIBLE,
  INDEX fk_resposta_resultado_final1_idx (id_resultado_final ASC) VISIBLE,
  CONSTRAINT fk_resposta_pergunta1 FOREIGN KEY (id_pergunta) REFERENCES pergunta (id_pergunta) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT fk_resposta_resultado_final1 FOREIGN KEY (id_resultado_final) REFERENCES resultado_final (id_resultado_final) ON DELETE NO ACTION ON UPDATE NO ACTION
);
