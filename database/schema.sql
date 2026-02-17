-- database/schema.sql

-- 1. Crear Base de Datos (Si no existe)
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'SaaDVibeDB')
BEGIN
    CREATE DATABASE SaaDVibeDB;
END
GO

USE SaaDVibeDB;
GO

-- 2. Tabla de Categorías
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Categories' AND xtype='U')
CREATE TABLE Categories (
    CategoryId INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(50) NOT NULL UNIQUE,
    Slug NVARCHAR(50) NOT NULL UNIQUE,
    Description NVARCHAR(255)
);
GO

-- 3. Tabla de Herramientas (AI Tools)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Tools' AND xtype='U')
CREATE TABLE Tools (
    ToolId INT IDENTITY(1,1) PRIMARY KEY,
    CategoryId INT FOREIGN KEY REFERENCES Categories(CategoryId),
    Name NVARCHAR(100) NOT NULL,
    Slug NVARCHAR(100) NOT NULL UNIQUE,
    Description NVARCHAR(MAX),
    WebsiteUrl NVARCHAR(500),
    PricingModel NVARCHAR(50) DEFAULT 'Freemium',
    Rating FLOAT DEFAULT 0,
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE()
);
GO

-- 4. Tabla de Prompts (Comunidad)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Prompts' AND xtype='U')
CREATE TABLE Prompts (
    PromptId INT IDENTITY(1,1) PRIMARY KEY,
    ToolId INT FOREIGN KEY REFERENCES Tools(ToolId),
    Title NVARCHAR(200) NOT NULL,
    Content NVARCHAR(MAX) NOT NULL,
    VoteCount INT DEFAULT 0,
    AuthorName NVARCHAR(100) DEFAULT 'Anónimo',
    CreatedAt DATETIME2 DEFAULT GETDATE()
);
GO

-- 5. Historial de Logs (Auditoría de IA)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='MetapromptLogs' AND xtype='U')
CREATE TABLE MetapromptLogs (
    LogId BIGINT IDENTITY(1,1) PRIMARY KEY,
    OriginalInput NVARCHAR(MAX),
    GeneratedOutput NVARCHAR(MAX),
    CategoryContext NVARCHAR(50),
    CreatedAt DATETIME2 DEFAULT GETDATE()
);
GO

-- 6. Índices de Rendimiento
CREATE NONCLUSTERED INDEX IX_Tools_Slug ON Tools(Slug);
CREATE NONCLUSTERED INDEX IX_Prompts_Ranking ON Prompts(VoteCount DESC);

-- 7. Datos Semilla (Seed Data)
-- Insertar Categorías
INSERT INTO Categories (Name, Slug) VALUES 
('Texto & Copywriting', 'text'), 
('Generación de Imagen', 'image'),
('Código & Dev', 'code');

-- Insertar Herramientas
INSERT INTO Tools (CategoryId, Name, Slug, Description, WebsiteUrl, Rating) VALUES 
(1, 'ChatGPT', 'chatgpt', 'El estándar de oro para conversación y texto.', 'https://chat.openai.com', 4.9),
(2, 'Midjourney', 'midjourney', 'Arte generativo de alta fidelidad.', 'https://midjourney.com', 4.8),
(3, 'GitHub Copilot', 'copilot', 'Tu par programador con IA.', 'https://github.com/features/copilot', 4.7);

-- Insertar Prompts de Ejemplo
INSERT INTO Prompts (ToolId, Title, Content, VoteCount, AuthorName) VALUES 
(1, 'Experto en SEO', 'Actúa como un experto en SEO con 10 años de experiencia. Genera una estructura de artículo optimizada para la palabra clave: "Inteligencia Artificial en Medicina".', 150, 'Admin'),
(2, 'Fotografía Realista', 'Fotografía cinemática de una calle de Tokio bajo la lluvia, luces de neón reflejadas en el asfalto, lente 85mm f/1.8, estilo cyberpunk, ultra detallado --v 6.0', 340, 'MidjourneyMaster');
GO