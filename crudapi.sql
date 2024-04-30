create database crudapi;

USE crudapi;

DROP TABLE USUARIO;

CREATE TABLE USUARIO(
	ID INT NOT null auto_increment primary KEY,
    NOME VARCHAR(50),
    IDADE INT
);

insert into USUARIO (NOME, IDADE) values ('ludmila', 18);
insert into USUARIO (NOME, IDADE) values ('Rafa', 28);
insert into USUARIO (NOME, IDADE) values ('Matheus', 24);
insert into USUARIO (NOME, IDADE) values ('Ana', 29);

DELETE FROM usuario WHERE ID = 1 ;

select *from usuario;