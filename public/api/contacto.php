<?php
/**
 * Recibe el formulario de contacto de la landing y lo reenvía por mail.
 *
 * La validación se repite acá entera: la del navegador es una cortesía para
 * la persona, no una defensa. Cualquiera puede postear a este archivo.
 *
 * Antes de usarlo en serio hay que tocar las dos constantes de abajo y dejar
 * el SMTP configurado (ver README, sección "El formulario de contacto").
 */

declare(strict_types=1);

/* --- Configuración ------------------------------------------------------ */

/** A dónde llegan las consultas. */
const DESTINO = 'gutierrezalexisnicolas@gmail.com';

/**
 * Remitente. Tiene que ser una casilla del dominio desde el que se envía, o
 * el servidor de destino lo va a tratar como spam. No se usa el email de quien
 * completa el formulario: eso es falsificar el remitente y lo filtran igual.
 */
const REMITENTE = 'no-responder@australfood.com.ar';

/** Copia local de cada consulta, por si el envío falla y hay que recuperarla. */
const BITACORA = __DIR__ . '/consultas.log';

/** Los mismos ids que exporta PLANES en src/data/contenido.ts. */
const PLANES = [
    'mensual' => 'Plan mensual',
    'anual'   => 'Plan anual',
    'unico'   => 'Pago único',
];

/* --- Utilidades --------------------------------------------------------- */

header('Content-Type: application/json; charset=utf-8');

function responder(int $codigo, array $cuerpo): never
{
    http_response_code($codigo);
    echo json_encode($cuerpo, JSON_UNESCAPED_UNICODE);
    exit;
}

/**
 * Saca saltos de línea de cualquier valor que termine dentro de una cabecera.
 * Sin esto, un "\r\nBcc: ..." en el nombre convierte el formulario en un relay
 * de spam. Es la inyección clásica de cabeceras de mail.
 */
function unaLinea(string $v): string
{
    return trim(preg_replace('/[\r\n]+/', ' ', $v));
}

/* --- Entrada ------------------------------------------------------------ */

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    responder(405, ['ok' => false, 'error' => 'Método no permitido.']);
}

$crudo = file_get_contents('php://input');
$datos = json_decode($crudo === false ? '' : $crudo, true);

if (!is_array($datos)) {
    responder(400, ['ok' => false, 'error' => 'No pudimos leer el formulario.']);
}

$campo = static fn(string $n): string => is_string($datos[$n] ?? null) ? trim($datos[$n]) : '';

$nombre   = $campo('nombre');
$apellido = $campo('apellido');
$email    = $campo('email');
$whatsapp = $campo('whatsapp');
$plan     = $campo('plan');
$mensaje  = $campo('mensaje');

/* --- Validación --------------------------------------------------------- */

$errores = [];

if ($nombre === '' || mb_strlen($nombre) > 80) {
    $errores[] = 'nombre';
}
if ($apellido === '' || mb_strlen($apellido) > 80) {
    $errores[] = 'apellido';
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($email) > 160) {
    $errores[] = 'email';
}

$digitos = preg_replace('/\D/', '', $whatsapp);
if (strlen($digitos) < 8 || strlen($digitos) > 15) {
    $errores[] = 'whatsapp';
}

if (!array_key_exists($plan, PLANES)) {
    $errores[] = 'plan';
}
if (mb_strlen($mensaje) > 2000) {
    $errores[] = 'mensaje';
}

if ($errores !== []) {
    responder(422, [
        'ok'    => false,
        'error' => 'Revisá los datos: hay algún campo incompleto o mal cargado.',
        'campos' => $errores,
    ]);
}

/* --- Armado ------------------------------------------------------------- */

$nombreCompleto = unaLinea("$nombre $apellido");
$asunto = "Consulta de $nombreCompleto por el " . PLANES[$plan];

$cuerpo = implode("\n", [
    'Nombre:   ' . $nombreCompleto,
    'Email:    ' . $email,
    'WhatsApp: ' . $whatsapp . '  (https://wa.me/' . $digitos . ')',
    'Plan:     ' . PLANES[$plan],
    '',
    'Mensaje:',
    $mensaje === '' ? '(sin mensaje)' : $mensaje,
    '',
    '--',
    'Enviado desde el formulario de australfood el ' . date('d/m/Y H:i'),
]);

$cabeceras = implode("\r\n", [
    'From: AustralFood <' . REMITENTE . '>',
    /* Responder en el cliente de mail le contesta a la persona, no al sitio. */
    'Reply-To: ' . unaLinea($nombreCompleto) . ' <' . unaLinea($email) . '>',
    'Content-Type: text/plain; charset=UTF-8',
    'MIME-Version: 1.0',
]);

/* Se guarda antes de enviar: si el SMTP está mal configurado, la consulta
   igual queda registrada y no se pierde el contacto. */
@file_put_contents(
    BITACORA,
    '===== ' . date('c') . " =====\n" . $cuerpo . "\n\n",
    FILE_APPEND | LOCK_EX
);

/* --- Envío -------------------------------------------------------------- */

$enviado = @mail(DESTINO, $asunto, $cuerpo, $cabeceras, '-f' . REMITENTE);

if (!$enviado) {
    responder(502, [
        'ok'    => false,
        'error' => 'Guardamos tu consulta pero el mail no salió. Escribinos por WhatsApp.',
    ]);
}

responder(200, ['ok' => true]);
